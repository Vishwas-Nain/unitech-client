import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { 
  LocalShipping as LocalShippingIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { formatPrice } from '../utils/currency';
import api from '../api/api';

const orderStatus = {
  PENDING: { color: '#F57C00', icon: <InfoIcon />, label: 'Pending' },
  PROCESSING: { color: '#1976D2', icon: <ReceiptIcon />, label: 'Processing' },
  SHIPPED: { color: '#2196F3', icon: <LocalShippingIcon />, label: 'Shipped' },
  OUT_FOR_DELIVERY: { color: '#673AB7', icon: <LocalShippingIcon />, label: 'Out for Delivery' },
  DELIVERED: { color: '#4CAF50', icon: <CheckCircleIcon />, label: 'Delivered' },
  CANCELLED: { color: '#D32F2F', icon: <InfoIcon />, label: 'Cancelled' },
  RETURNED: { color: '#9E9E9E', icon: <InfoIcon />, label: 'Returned' }
};

const Order = () => {
  const { id } = useParams();
  const navigate = useNavigate();
    const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Fetch real order data from API
        const response = await api.get(`/api/orders/${id}`);
        
        if (response.data && response.data.success) {
          setOrder(response.data.order);
        } else {
          // Handle API error
          setError('Order not found or failed to load');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to fetch order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/orders')} sx={{ mt: 2 }}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Order not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/orders')} sx={{ mt: 2 }}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Order #{order.orderNumber || order.id}
      </Typography>
      
      {/* Order Status and Basic Info */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  Status:
                </Typography>
                <Chip
                  label={orderStatus[order.status]?.label || order.status}
                  sx={{
                    backgroundColor: orderStatus[order.status]?.color || '#666',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                  icon={orderStatus[order.status]?.icon}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Order Date: {formatDate(order.created_at || order.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Payment Method: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Payment Status: {order.paymentStatus || 'Pending'}
              </Typography>
              {order.trackingNumber && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tracking Number: {order.trackingNumber}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">{formatPrice(order.subtotal || (order.total || order.totalAmount) * 0.8475)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Shipping:</Typography>
                <Typography variant="body2">{formatPrice(order.shipping || 0)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tax:</Typography>
                <Typography variant="body2">{formatPrice(order.tax || ((order.total || order.totalAmount) * 0.18 / 1.18))}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(order.total || order.totalAmount)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Items Table */}
      <Paper elevation={2} sx={{ mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={item.product?.image || item.image || '/placeholder-product.jpg'}
                        alt={item.product?.name || item.name}
                        style={{ 
                          width: 50, 
                          height: 50, 
                          objectFit: 'cover', 
                          marginRight: 16,
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px'
                        }}
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                      <Typography>{item.product?.name || item.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{formatPrice(item.price)}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">{formatPrice(item.price * item.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Typography variant="body1">
              {order.shippingAddress.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress.address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: {order.shippingAddress.phone}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/orders')}
          sx={{ mr: 2 }}
        >
          Back to Orders
        </Button>
        <Box>
          <Button
            variant="outlined"
            onClick={() => navigate('/products')}
            sx={{ mr: 2 }}
          >
            Continue Shopping
          </Button>
          <Button
            variant="contained"
            onClick={() => window.print()}
          >
            Print Invoice
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Order;
