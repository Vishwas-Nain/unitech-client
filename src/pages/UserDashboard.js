import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Paper,
  Avatar,
  Button,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ShoppingBag as OrdersIcon,
  ShoppingCart as CartIcon,
  Favorite as WishlistIcon,
  LocationOn as AddressIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { getUserProfile, getUserOrders, updateUserProfile } from '../api/api';

const drawerWidth = 240;

const UserDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('overview');
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const profileResponse = await getUserProfile();
      if (profileResponse.success) {
        setUserProfile(profileResponse.user);
        setEditForm({
          name: profileResponse.user.name,
          email: profileResponse.user.email,
          mobile: profileResponse.user.mobile
        });
      }

      const ordersResponse = await getUserOrders();
      if (ordersResponse.success) {
        setOrders(ordersResponse.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleEditProfile = async () => {
    try {
      const response = await updateUserProfile(editForm);
      if (response.success) {
        setUserProfile(response.user);
        setEditProfileOpen(false);
        // Show success message
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          User Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem 
          button 
          selected={selectedSection === 'overview'}
          onClick={() => handleSectionChange('overview')}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard Overview" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'profile'}
          onClick={() => handleSectionChange('profile')}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile Management" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'orders'}
          onClick={() => handleSectionChange('orders')}
        >
          <ListItemIcon>
            <OrdersIcon />
          </ListItemIcon>
          <ListItemText primary="My Orders" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'cart'}
          onClick={() => navigate('/cart')}
        >
          <ListItemIcon>
            <CartIcon />
          </ListItemIcon>
          <ListItemText primary="Cart" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'wishlist'}
          onClick={() => handleSectionChange('wishlist')}
        >
          <ListItemIcon>
            <WishlistIcon />
          </ListItemIcon>
          <ListItemText primary="Wishlist" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'addresses'}
          onClick={() => handleSectionChange('addresses')}
        >
          <ListItemIcon>
            <AddressIcon />
          </ListItemIcon>
          <ListItemText primary="Address Management" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => navigate('/')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Back to Home" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  const renderOverview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Welcome back!
            </Typography>
            <Typography variant="h4" color="primary">
              {userProfile?.name}
            </Typography>
            <Typography color="textSecondary">
              {userProfile?.email}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Orders
            </Typography>
            <Typography variant="h4">
              {orders.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Account Status
            </Typography>
            <Chip 
              label={userProfile?.isVerified ? 'Verified' : 'Not Verified'} 
              color={userProfile?.isVerified ? 'success' : 'warning'} 
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.slice(0, 5).map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id.slice(-8)}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status || 'Pending'} 
                          color="primary" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>${order.totalAmount || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderProfile = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
                {userProfile?.name?.[0] || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h5">{userProfile?.name}</Typography>
                <Typography color="textSecondary">{userProfile?.email}</Typography>
                <Typography color="textSecondary">{userProfile?.mobile}</Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<EditIcon />}
              onClick={() => setEditProfileOpen(true)}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<LockIcon />}
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => navigate('/change-password')}
            >
              Change Password
            </Button>
            <Typography variant="body2" color="textSecondary">
              Account verified: {userProfile?.isVerified ? 'Yes' : 'No'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderOrders = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order History
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id.slice(-8)}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status || 'Pending'} 
                      color="primary" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{order.items?.length || 0}</TableCell>
                  <TableCell>${order.totalAmount || 0}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderWishlist = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          My Wishlist
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Your wishlist is empty. Start adding products you love!
        </Typography>
      </CardContent>
    </Card>
  );

  const renderAddresses = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Address Management
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No addresses saved yet. Add your shipping address for faster checkout.
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }}>
          Add Address
        </Button>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case 'overview':
        return renderOverview();
      case 'profile':
        return renderProfile();
      case 'orders':
        return renderOrders();
      case 'wishlist':
        return renderWishlist();
      case 'addresses':
        return renderAddresses();
      default:
        return renderOverview();
    }
  };

  if (loading && !userProfile) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1).replace(/([A-Z])/g, ' $1')}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          {renderContent()}
        </Container>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Mobile"
            fullWidth
            variant="outlined"
            value={editForm.mobile}
            onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProfileOpen(false)}>Cancel</Button>
          <Button onClick={handleEditProfile} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDashboard;
