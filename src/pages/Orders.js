import React, { useState, useEffect } from 'react';
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
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import { useAuth } from '../context/AuthContext';

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

  // Fetch orders from API
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('/api/orders');
        // setOrders(response.data);
        
        // Simulated response
        setTimeout(() => {
          const mockOrders = [
            {
              id: 'ORD' + Math.floor(Math.random() * 1000000),
              date: new Date().toISOString(),
              status: 'DELIVERED',
              items: [
                { id: 1, name: 'Gaming Laptop', quantity: 1, price: 99999, image: '/images/products/laptop.jpg' },
                { id: 2, name: 'Wireless Mouse', quantity: 2, price: 1999, image: '/images/products/mouse.jpg' }
              ],
              total: 103997,
              shippingAddress: {
                fullName: 'John Doe',
                address: '123 Main Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001',
                phone: '9876543210'
              },
              paymentMethod: 'COD',
              paymentStatus: 'PAID',
              trackingNumber: 'TRK' + Math.floor(Math.random() * 1000000),
              deliveryDate: new Date(Date.now() - 3 * 86400000).toISOString()
            }
          ];
          
          // Store in localStorage to prevent duplicates when navigating back
          localStorage.setItem('userOrders', JSON.stringify(mockOrders));
          setOrders(mockOrders);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
        setLoading(false);
      }
    };

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
  }, [isLoggedIn, navigate]);

  const getStatusColor = (status) => {
    return orderStatus[status]?.color || theme.palette.primary.main;
  };

  const getStatusIcon = (status) => {
    return orderStatus[status]?.icon || <ReceiptIcon />;
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
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

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Payment Method: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Credit/Debit Card'}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ReceiptIcon />}
                  onClick={() => handleViewOrder(order.id)}
                >
                  View Details
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Orders;
