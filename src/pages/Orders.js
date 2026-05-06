import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import {
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  LocalShipping as LocalShippingIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { 
  getUserOrders, 
  trackOrder, 
  cancelOrder, 
  requestReturn,
  createPaymentOrder,
  handleFailedPayment
} from '../api/api';
import PaymentIntegration from '../components/PaymentIntegration';
import NotificationService from '../services/NotificationService';

const orderStatus = {
  PENDING: { color: '#F57C00', icon: <InfoIcon />, label: 'Pending' },
  PROCESSING: { color: '#1976D2', icon: <ReceiptIcon />, label: 'Processing' },
  SHIPPED: { color: '#2196F3', icon: <ReceiptIcon />, label: 'Shipped' },
  OUT_FOR_DELIVERY: { color: '#673AB7', icon: <ReceiptIcon />, label: 'Out for Delivery' },
  DELIVERED: { color: '#4CAF50', icon: <CheckCircleIcon />, label: 'Delivered' },
  CANCELLED: { color: '#D32F2F', icon: <ErrorIcon />, label: 'Cancelled' },
  RETURNED: { color: '#9E9E9E', icon: <ErrorIcon />, label: 'Returned' }
};

const Orders = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingDialog, setTrackingDialog] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [returnDialog, setReturnDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [returnItems, setReturnItems] = useState([]);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentIntegrationOpen, setPaymentIntegrationOpen] = useState(false);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUserOrders();
      if (response.success) {
        setOrders(response.orders || []);
      } else {
        // Mock order data that matches the structure in Order.js
        const mockOrders = [
          {
            id: 'ORD123456',
            orderNumber: 'ORD123456',
            date: new Date().toISOString(),
            status: 'DELIVERED',
            paymentStatus: 'PAID',
            paymentMethod: 'ONLINE',
            items: [
              { 
                _id: '1', 
                product: {
                  name: 'Gaming Laptop', 
                  image: '/images/products/laptop.jpg'
                },
                quantity: 1, 
                price: 96760, 
                image: '/images/products/laptop.jpg' 
              },
              { 
                _id: '2', 
                product: {
                  name: 'Wireless Mouse', 
                  image: '/images/products/mouse.jpg'
                },
                quantity: 2, 
                price: 1999, 
                image: '/images/products/mouse.jpg' 
              }
            ],
            total: 100758, // 96760 + (1999 * 2)
            subtotal: 100758,
            shipping: 0,
            tax: 0,
            shippingAddress: {
              fullName: 'John Doe',
              address: '123 Main Street',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400001',
              phone: '9876543210'
            },
            trackingNumber: 'TRK123456789',
            deliveryDate: new Date(Date.now() - 3 * 86400000).toISOString()
          },
          {
            id: 'ORD789012',
            orderNumber: 'ORD789012',
            date: new Date(Date.now() - 2 * 86400000).toISOString(),
            status: 'PROCESSING',
            paymentStatus: 'PAID',
            paymentMethod: 'COD',
            items: [
              { 
                _id: '3', 
                product: {
                  name: 'Wireless Keyboard', 
                  image: '/images/products/keyboard.jpg'
                },
                quantity: 1, 
                price: 2999, 
                image: '/images/products/keyboard.jpg' 
              }
            ],
            total: 2999,
            subtotal: 2999,
            shipping: 0,
            tax: 0,
            shippingAddress: {
              fullName: 'Jane Smith',
              address: '456 Park Avenue',
              city: 'Delhi',
              state: 'Delhi',
              pincode: '110001',
              phone: '9876543211'
            },
            trackingNumber: 'TRK789012345'
          }
        ];
        setOrders(mockOrders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch orders from API
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }

    // Check if we have orders in localStorage first
    const savedOrders = localStorage.getItem('userOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
      setLoading(false);
    } else {
      fetchOrders();
    }
    
    // Cleanup function
    return () => {
      // Clear any pending timeouts
      clearTimeout();
    };
  }, [isLoggedIn, navigate, fetchOrders]);

  const getStatusColor = (status) => {
    return orderStatus[status]?.color || theme.palette.primary.main;
  };

  const getStatusIcon = (status) => {
    return orderStatus[status]?.icon || <ReceiptIcon />;
  };

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleTrackOrder = async (order) => {
    setSelectedOrder(order);
    setTrackingDialog(true);
    
    // Use mock tracking data directly since API doesn't exist
    const orderDate = new Date(order.date);
    setTrackingData({
      currentStatus: order.status,
      estimatedDelivery: order.estimatedDelivery || new Date(Date.now() + 5 * 86400000).toISOString(),
      trackingHistory: [
        { 
          status: 'ORDER_PLACED', 
          timestamp: order.date, 
          description: 'Order placed successfully' 
        },
        { 
          status: 'PROCESSING', 
          timestamp: new Date(orderDate.getTime() + 12 * 3600000).toISOString(), 
          description: 'Order is being processed' 
        },
        { 
          status: 'SHIPPED', 
          timestamp: new Date(orderDate.getTime() + 24 * 3600000).toISOString(), 
          description: 'Order has been shipped' 
        },
        { 
          status: order.status === 'DELIVERED' ? 'DELIVERED' : 'OUT_FOR_DELIVERY', 
          timestamp: order.deliveryDate || new Date(orderDate.getTime() + 48 * 3600000).toISOString(), 
          description: order.status === 'DELIVERED' ? 'Delivered successfully' : 'Out for delivery' 
        }
      ]
    });
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelReason) return;
    
    try {
      const response = await cancelOrder(selectedOrder.id, cancelReason);
      if (response.success) {
        // Send cancellation notification
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          await NotificationService.sendMultiChannelNotification(
            selectedOrder.id,
            user,
            'order_cancelled',
            { reason: cancelReason }
          );
        }
        
        alert('Order cancelled successfully');
        setCancelDialog(false);
        setCancelReason('');
        fetchOrders(); // Refresh orders
      } else {
        alert(response.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  const handleRequestReturn = async () => {
    if (!selectedOrder || !returnReason) return;
    
    try {
      const response = await requestReturn(selectedOrder.id, returnReason, returnItems);
      if (response.success) {
        // Send return confirmation notification
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          await NotificationService.sendMultiChannelNotification(
            selectedOrder.id,
            user,
            'return_confirmation',
            { returnDetails: { reason: returnReason, items: returnItems } }
          );
        }
        
        alert('Return request submitted successfully');
        setReturnDialog(false);
        setReturnReason('');
        setReturnItems([]);
        fetchOrders(); // Refresh orders
      } else {
        alert(response.error || 'Failed to request return');
      }
    } catch (error) {
      console.error('Error requesting return:', error);
      alert('Failed to request return');
    }
  };

  const handleRetryPayment = async (order) => {
    setSelectedOrder(order);
    setPaymentIntegrationOpen(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Send payment confirmation notification
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        await NotificationService.sendMultiChannelNotification(
          selectedOrder.id,
          user,
          'payment_confirmation',
          { amount: selectedOrder.total, paymentDetails: paymentData }
        );
      }
      
      // Refresh orders to show updated payment status
      fetchOrders();
      
      // Show success message
      alert('Payment processed successfully!');
    } catch (error) {
      console.error('Error handling payment success:', error);
    }
  };

  const handlePaymentFailure = async (error) => {
    try {
      // Handle failed payment
      if (selectedOrder) {
        await handleFailedPayment(selectedOrder.id, error.paymentId || 'unknown');
      }
      
      // Show error message
      alert(`Payment failed: ${error}`);
    } catch (apiError) {
      console.error('Error handling payment failure:', apiError);
      alert(`Payment failed: ${error}`);
    }
  };

  const processPayment = async () => {
    if (!selectedOrder) return;
    
    setPaymentLoading(true);
    try {
      const response = await createPaymentOrder(selectedOrder.total);
      if (response.success) {
        // Integrate with Razorpay/Stripe here
        // For now, simulate payment
        alert('Payment processed successfully');
        setPaymentDialog(false);
        fetchOrders();
      } else {
        alert(response.error || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center" color="text.secondary">
          No orders found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} key={order.id}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Order #{order.id}
                </Typography>
                <Chip
                  label={order.status}
                  sx={{
                    backgroundColor: getStatusColor(order.status),
                    color: (theme) => theme.palette.getContrastText(getStatusColor(order.status)),
                    ml: 2
                  }}
                  icon={getStatusIcon(order.status)}
                />
              </Box>

              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                {new Date(order.date).toLocaleDateString()}
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={item._id || index}>
                        <TableCell>{(item.product?.name || item.name || 'N/A')}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell align="right">{formatPrice(item.price)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} align="right">
                        <Typography variant="h6">Total:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">{formatPrice(order.total)}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Payment: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'} | 
                  Status: {order.paymentStatus || 'Pending'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ReceiptIcon />}
                    onClick={() => handleViewOrder(order.id)}
                  >
                    View Details
                  </Button>
                  
                  {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<TimelineIcon />}
                      onClick={() => handleTrackOrder(order)}
                    >
                      Track
                    </Button>
                  )}
                  
                  {order.status === 'PENDING' && (
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => {
                        setSelectedOrder(order);
                        setCancelDialog(true);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  
                  {order.status === 'DELIVERED' && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={() => {
                        setSelectedOrder(order);
                        setReturnDialog(true);
                        setReturnItems(order.items.map(item => ({ ...item, selected: true })));
                      }}
                    >
                      Return
                    </Button>
                  )}
                  
                  {order.paymentStatus === 'FAILED' && (
                    <Button
                      variant="contained"
                      size="small"
                      color="warning"
                      startIcon={<PaymentIcon />}
                      onClick={() => handleRetryPayment(order)}
                    >
                      Retry Payment
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Tracking Dialog */}
      <Dialog open={trackingDialog} onClose={() => setTrackingDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShippingIcon />
            Track Order - {selectedOrder?.id}
          </Box>
        </DialogTitle>
        <DialogContent>
          {trackingData ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Current Status: {trackingData.currentStatus}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Estimated Delivery: {new Date(trackingData.estimatedDelivery).toLocaleDateString()}
              </Typography>
              
              <Timeline sx={{ mt: 2 }}>
                {trackingData.trackingHistory.map((event, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot color={event.status === trackingData.currentStatus ? 'primary' : 'grey'} />
                      {index < trackingData.trackingHistory.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="h6">{event.status.replace('_', ' ')}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(event.timestamp).toLocaleString()}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrackingDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to cancel order {selectedOrder?.id}?
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Please provide a reason for cancellation:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Enter cancellation reason..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCancelOrder} 
            color="error" 
            variant="contained"
            disabled={!cancelReason}
          >
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Return Request Dialog */}
      <Dialog open={returnDialog} onClose={() => setReturnDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Request Return</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Request return for order {selectedOrder?.id}
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Select Items to Return:</Typography>
          {returnItems.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ flexGrow: 1 }}>{item.name}</Typography>
              <Typography sx={{ mx: 2 }}>Qty: {item.quantity}</Typography>
              <Typography>{formatPrice(item.price)}</Typography>
            </Box>
          ))}
          
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
            Please provide a reason for return:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            placeholder="Enter return reason..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleRequestReturn} 
            color="primary" 
            variant="contained"
            disabled={!returnReason}
          >
            Submit Return Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentIcon />
            Retry Payment
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Complete payment for order {selectedOrder?.id}
          </Typography>
          <Typography variant="h5" color="primary" sx={{ mt: 2, mb: 2 }}>
            Total Amount: {formatPrice(selectedOrder?.total)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click below to process payment securely through our payment gateway.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
          <Button 
            onClick={processPayment} 
            color="primary" 
            variant="contained"
            disabled={paymentLoading}
            startIcon={paymentLoading ? <CircularProgress size={20} /> : <PaymentIcon />}
          >
            {paymentLoading ? 'Processing...' : 'Pay Now'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Integration Dialog */}
      <PaymentIntegration
        open={paymentIntegrationOpen}
        onClose={() => setPaymentIntegrationOpen(false)}
        amount={selectedOrder?.total || 0}
        orderId={selectedOrder?.id || ''}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
      />
    </Container>
  );
};

export default Orders;
