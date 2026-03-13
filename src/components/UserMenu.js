import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Avatar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Popover,
  Paper
} from '@mui/material';
import {
  Person,
  PersonOutline,
  Settings,
  Logout,
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../api/api';

const UserMenu = ({ user, isLoggedIn, logout }) => {
  const [userAnchor, setUserAnchor] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const handleUserClick = (event) => {
    setUserAnchor(event.currentTarget);
  };

  const handleUserClose = () => {
    setUserAnchor(null);
  };

  const handleNavigation = (path) => {
    handleUserClose();
    navigate(path, { state: { from: 'navbar' } });
  };

  const handleRefreshRole = async () => {
    setRefreshing(true);
    try {
      const response = await getUserProfile();
      if (response.success) {
        // Update user data in AuthContext
        const updateResult = updateUser(response.user);
        if (updateResult.success) {
          console.log('User role refreshed successfully');
          // Force page reload to update UI
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Failed to refresh user role:', error);
    } finally {
      setRefreshing(false);
      handleUserClose();
    }
  };

  // Get user from localStorage to check role
  const getUser = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };

  const currentUser = getUser();
  return (
    <>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls="primary-search-account-menu"
        aria-haspopup="true"
        onClick={handleUserClick}
        color="inherit"
        sx={{ p: 0, ml: 1 }}
      >
        {user?.profilePicture ? (
          <Avatar 
            src={user.profilePicture} 
            alt={user.name || 'User'}
            sx={{ width: 40, height: 40 }}
          />
        ) : (
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            {user?.name?.charAt(0)?.toUpperCase() || <PersonOutline />}
          </Avatar>
        )}
      </IconButton>

      <Popover
        open={Boolean(userAnchor)}
        anchorEl={userAnchor}
        onClose={handleUserClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        }}
      >
        <Paper sx={{ p: 2 }}>
          {isLoggedIn ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                  {user?.name?.[0] || 'U'}
                </Avatar>
                <Typography variant="h6">
                  {user?.name || 'User'}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <ListItem
                button
                onClick={() => {
                  if (currentUser?.role === 'admin') {
                    handleNavigation('/admin/dashboard');
                  } else {
                    handleNavigation('/user/dashboard');
                  }
                }}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>

              {/* Admin Panel - Only show for admin users */}
              {currentUser?.role === 'admin' && (
                <ListItem
                  button
                  onClick={() => handleNavigation('/admin/dashboard')}
                >
                  <ListItemIcon>
                    <AdminIcon />
                  </ListItemIcon>
                  <ListItemText primary="Admin Panel" />
                </ListItem>
              )}

              {/* Refresh Role - Show if role might have changed */}
              <ListItem
                button
                onClick={handleRefreshRole}
                disabled={refreshing}
              >
                <ListItemIcon>
                  {refreshing ? (
                    <CircularProgress size={20} />
                  ) : (
                    <RefreshIcon />
                  )}
                </ListItemIcon>
                <ListItemText primary={refreshing ? "Refreshing..." : "Refresh Role"} />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  handleNavigation('/orders')
                }}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="My Orders" />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  handleNavigation('/favorites')
                }}
              >
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText primary="Favorites" />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  logout();
                  handleUserClose();
                }}
                sx={{ mt: 2 }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <>
              <Button
                fullWidth
                startIcon={<LoginIcon />}
                onClick={() => handleNavigation('/login')}
                sx={{
                  mb: 1,
                  textTransform: 'none',
                  borderRadius: '8px',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Login
              </Button>
              <Button
                fullWidth
                startIcon={<PersonIcon />}
                onClick={() => handleNavigation('/register')}
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Register
              </Button>
            </>
          )}
        </Paper>
      </Popover>
    </>
  );
};

export default UserMenu;
