import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Popover,
  Paper,
  Typography,
  Divider,
  Button,
  Avatar,
  Box,
  useTheme,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Person as PersonIcon,
  PersonOutline as PersonOutlineIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Favorite as FavoriteIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  Person as UserIcon
} from '@mui/icons-material';

const UserMenu = ({ user, isLoggedIn, logout }) => {
  const [userAnchor, setUserAnchor] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

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
            {user?.name?.charAt(0)?.toUpperCase() || <PersonOutlineIcon />}
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
                onClick={() => handleNavigation('/dashboard')}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
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
