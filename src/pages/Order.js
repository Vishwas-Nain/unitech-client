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
        // For now, use mock data since API might not be implemented
        // In production, this would be: const response = await api.get(`/api/orders/${id}`);
        
        // Mock order data that matches the structure from Orders.js
        // Use different mock data based on order ID to simulate different orders
        let mockOrder;
        
        if (id === 'ORD123456') {
          mockOrder = {
            id: id,
            orderNumber: id,
            status: 'DELIVERED',
            paymentStatus: 'PAID',
            paymentMethod: 'ONLINE',
            createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
            total: 103997,
            subtotal: 101998,
            shipping: 1999,
            tax: 0,
            items: [
              {
                _id: '1',
                product: {
                  name: 'Gaming Laptop',
                  image: '/images/products/laptop.jpg'
                },
                price: 99999,
                quantity: 1
              },
              {
                _id: '2', 
                product: {
                  name: 'Wireless Mouse',
                  image: '/images/products/mouse.jpg'
                },
                price: 1999,
                quantity: 2
              }
            ],
            shippingAddress: {
              fullName: 'John Doe',
              address: '123 Main Street',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400001',
              phone: '9876543210'
            },
            trackingNumber: 'TRK123456789',
            estimatedDelivery: new Date(Date.now() - 1 * 86400000).toISOString()
          };
        } else if (id === 'ORD789012') {
          mockOrder = {
            id: id,
            orderNumber: id,
            status: 'PROCESSING',
            paymentStatus: 'PAID',
            paymentMethod: 'COD',
            createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            total: 2999,
            subtotal: 2999,
            shipping: 0,
            tax: 0,
            items: [
              {
                _id: '3',
                product: {
                  name: 'Wireless Keyboard',
                  image: '/images/products/keyboard.jpg'
                },
                price: 2999,
                quantity: 1
              }
            ],
            shippingAddress: {
              fullName: 'Jane Smith',
              address: '456 Park Avenue',
              city: 'Delhi',
              state: 'Delhi',
              pincode: '110001',
              phone: '9876543211'
            },
            trackingNumber: 'TRK789012345',
            estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString()
          };
        } else {
          // Default mock order for any other ID
          mockOrder = {
            id: id,
            orderNumber: id,
            status: 'SHIPPED',
            paymentStatus: 'PAID',
            paymentMethod: 'ONLINE',
            createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
            total: 5999,
            subtotal: 5799,
            shipping: 200,
            tax: 0,
            items: [
              {
                _id: '4',
                product: {
                  name: 'USB-C Hub',
                  image: '/images/products/hub.jpg'
                },
                price: 5799,
                quantity: 1
              }
            ],
            shippingAddress: {
              fullName: 'Alex Johnson',
              address: '789 Tech Street',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560001',
              phone: '9876543212'
            },
            trackingNumber: 'TRK555666777',
            estimatedDelivery: new Date(Date.now() + 2 * 86400000).toISOString()
          };
        }
        
        setOrder(mockOrder);
      } catch (err) {
        setError('Failed to fetch order details. Please try again later.');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatDate = (dateString) => {
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
                Order Date: {formatDate(order.createdAt)}
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
                <Typography variant="body2">{formatPrice(order.subtotal || order.total)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Shipping:</Typography>
                <Typography variant="body2">{formatPrice(order.shipping || 0)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tax:</Typography>
                <Typography variant="body2">{formatPrice(order.tax || 0)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(order.total)}
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
                        src={item.product?.image || item.image}
                        alt={item.product?.name || item.name}
                        style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 16 }}
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
