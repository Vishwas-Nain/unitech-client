import React, { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  Box, 
  CircularProgress,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { Payment as PaymentIcon, CreditCard as CreditCardIcon } from '@mui/icons-material';

const PaymentIntegration = ({ 
  open, 
  onClose, 
  amount, 
  orderId, 
  onSuccess, 
  onFailure 
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [error, setError] = useState('');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const loadStripeScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError('Failed to load payment gateway. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create order on backend
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount, currency: 'INR' })
      });
      
      const orderData = await response.json();
      
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Test key
        amount: amount * 100, // Razorpay works with paise
        currency: 'INR',
        name: 'Unitech Production',
        description: `Payment for Order ${orderId}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          // Verify payment on backend
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId
            })
          });

          const verification = await verifyResponse.json();
          
          if (verification.success) {
            onSuccess(verification);
            onClose();
          } else {
            onFailure(verification.error || 'Payment verification failed');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#1976D2'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            onFailure('Payment cancelled by user');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Razorpay payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    const scriptLoaded = await loadStripeScript();
    if (!scriptLoaded) {
      setError('Failed to load payment gateway. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create payment intent on backend
      const response = await fetch('/api/payment/stripe/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount, orderId })
      });
      
      const paymentData = await response.json();
      
      if (!paymentData.success) {
        throw new Error(paymentData.error || 'Failed to create payment intent');
      }

      // Initialize Stripe
      const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_1234567890');
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.clientSecret,
        {
          payment_method: {
            card: {
              // Card elements would be rendered here in a real implementation
            }
          }
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess({ paymentIntent });
        onClose();
      } else {
        onFailure('Payment not completed');
      }

    } catch (error) {
      console.error('Stripe payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else if (paymentMethod === 'stripe') {
      handleStripePayment();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaymentIcon />
          Complete Payment
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Complete payment for Order #{orderId}
        </Typography>
        
        <Typography variant="h5" color="primary" sx={{ mt: 2, mb: 2 }}>
          Total Amount: ${amount.toLocaleString()}
        </Typography>

        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend">Select Payment Method</FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel 
              value="razorpay" 
              control={<Radio />} 
              label="Razorpay (UPI, Cards, Net Banking)" 
            />
            <FormControlLabel 
              value="stripe" 
              control={<Radio />} 
              label="Stripe (International Cards)" 
            />
          </RadioGroup>
        </FormControl>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          <strong>Security Notice:</strong> Your payment information is secure and encrypted. 
          We do not store your card details.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handlePayment} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
        >
          {loading ? 'Processing...' : `Pay with ${paymentMethod === 'razorpay' ? 'Razorpay' : 'Stripe'}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentIntegration;
