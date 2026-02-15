import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  useTheme
} from '@mui/material';
import {
  ShoppingCart as OrdersIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as ProfileIcon,
  Favorite as FavoritesIcon,
  CreditCard as PaymentsIcon,
  LocationOn as AddressesIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { 
  Alert, 
  Chip 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch recent orders from API
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/dashboard' } });
      return;
    }

    const fetchRecentOrders = async () => {
      try {
        setOrdersLoading(true);
        // In a real app, replace with your actual API endpoint
        // const response = await axios.get('/api/orders/recent', {
        //   params: { limit: 5 } // Get only the 5 most recent orders
        // });
        
        // Simulated API response with realistic data
        const now = new Date();
        const mockOrders = [
          {
            id: `ORD${Math.floor(100000 + Math.random() * 900000)}`,
            date: new Date(now - 0).toISOString(), // Most recent
            status: 'DELIVERED',
            total: 103997,
            itemCount: 2,
            items: [
              { name: 'Gaming Laptop', quantity: 1, price: 99999 },
              { name: 'Wireless Mouse', quantity: 2, price: 1999 }
            ]
          },
          {
            id: `ORD${Math.floor(100000 + Math.random() * 900000)}`,
            date: new Date(now - 2 * 86400000).toISOString(), // 2 days ago
            status: 'SHIPPED',
            total: 14999,
            itemCount: 1,
            items: [
              { name: 'External SSD', quantity: 1, price: 14999 }
            ]
          },
          {
            id: `ORD${Math.floor(100000 + Math.random() * 900000)}`,
            date: new Date(now - 7 * 86400000).toISOString(), // 7 days ago
            status: 'DELIVERED',
            total: 45999,
            itemCount: 3,
            items: [
              { name: 'Wireless Earbuds', quantity: 1, price: 7999 },
              { name: 'Smartwatch', quantity: 1, price: 29999 },
              { name: 'Phone Case', quantity: 1, price: 8001 }
            ]
          }
        ];

        // Sort orders by date (newest first)
        const sortedOrders = mockOrders.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );

        setRecentOrders(sortedOrders);
        // Cache the orders in localStorage for offline access
        localStorage.setItem('recentOrders', JSON.stringify(sortedOrders));
        setError('');
      } catch (err) {
        console.error('Error fetching recent orders:', err);
        setError('Failed to load recent orders. Using cached data.');
        // Try to load from cache if API fails
        const cachedOrders = localStorage.getItem('recentOrders');
        if (cachedOrders) {
          setRecentOrders(JSON.parse(cachedOrders));
        }
      } finally {
        setOrdersLoading(false);
        setLoading(false);
      }
    };

    // Set up real-time updates (polling every 30 seconds)
    fetchRecentOrders();
    const intervalId = setInterval(fetchRecentOrders, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [isLoggedIn]);

  const dashboardItems = [
    { 
      title: 'My Orders', 
      description: 'Track, return, or buy things again', 
      icon: <OrdersIcon fontSize="large" />,
      path: '/orders'
    },
    { 
      title: 'My Profile', 
      description: 'Edit your profile information', 
      icon: <ProfileIcon fontSize="large" />,
      path: '/profile'
    },
    { 
      title: 'My Favorites', 
      description: 'View your saved items', 
      icon: <FavoritesIcon fontSize="large" />,
      path: '/favorites'
    },
    { 
      title: 'Payment Methods', 
      description: 'Manage your payment options', 
      icon: <PaymentsIcon fontSize="large" />,
      path: '/payments'
    },
    { 
      title: 'Address Book', 
      description: 'Edit your shipping addresses', 
      icon: <AddressesIcon fontSize="large" />,
      path: '/addresses'
    },
    { 
      title: 'Security', 
      description: 'Update password and security settings', 
      icon: <SecurityIcon fontSize="large" />,
      path: '/security'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'PENDING': 'warning.main',
      'PROCESSING': 'info.main',
      'SHIPPED': 'primary.main',
      'DELIVERED': 'success.main',
      'CANCELLED': 'error.main',
      'RETURNED': 'text.secondary'
    };
    return statusColors[status] || 'text.primary';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name || 'Customer'}
      </Typography>
      
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Quick Actions
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4]
                }
              }}
              onClick={() => navigate(item.path)}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mb: 4, boxShadow: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Orders</Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/orders')}
            disabled={recentOrders.length === 0}
            size="small"
            startIcon={<OrdersIcon />}
          >
            View All Orders
          </Button>
        </Box>
        
        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {ordersLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : recentOrders.length > 0 ? (
          <Box sx={{ '& > *:not(:last-child)': { mb: 2 } }}>
            {recentOrders.map((order) => (
              <Card 
                key={order.id} 
                variant="outlined"
                sx={{
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Order #{order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(order.date)}
                      </Typography>
                    </Box>
                    <Chip 
                      label={order.status}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(order.status)}.light`,
                        color: 'white',
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {order.items.slice(0, 2).map(item => `${item.name} (${item.quantity})`).join(', ')}
                      {order.items.length > 2 ? ` +${order.items.length - 2} more` : ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total: <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        ₹{order.total.toLocaleString('en-IN')}
                      </Box>
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => navigate(`/order/${order.id}`)}
                      sx={{ textTransform: 'none' }}
                    >
                      View Details
                    </Button>
                    {order.status === 'DELIVERED' && (
                      <Button 
                        size="small" 
                        variant="outlined"
                        color="primary"
                        sx={{ textTransform: 'none', ml: 1 }}
                      >
                        Buy Again
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', p: 4, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
            <ShoppingCartIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Orders Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
              You haven't placed any orders yet. Start shopping to see your order history here.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/products')}
              size="large"
              sx={{ mt: 1 }}
            >
              Start Shopping
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;
