import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Avatar,
  Divider,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: null,
    profilePictureUrl: ''
  });
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      setLoading(false);
    } else {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'profilePicture' && files && files[0]) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: file,
          profilePictureUrl: reader.result
        }));
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      
      if (formData.profilePicture) {
        formDataToSend.append('profilePicture', formData.profilePicture);
      }

      // In a real app, you would make an API call here to update the user's profile
      // Example:
      // const response = await axios.put('/api/users/profile', formDataToSend, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      
      // For now, we'll just update the user context with the new data
      const updatedUser = {
        ...user,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        profilePicture: formData.profilePictureUrl || user.profilePicture
      };
      
      await updateUser(updatedUser);
      
      // Save the profile picture URL to localStorage if it's a data URL
      if (formData.profilePictureUrl && formData.profilePictureUrl.startsWith('data:image')) {
        localStorage.setItem('userProfilePicture', formData.profilePictureUrl);
      }
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            My Profile
          </Typography>
          {!editing && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  src={previewUrl || user?.profilePicture || ''}
                  sx={{
                    width: 150,
                    height: 150,
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                    border: '3px solid',
                    borderColor: 'primary.light',
                    '&:hover': {
                      opacity: editing ? 0.8 : 1,
                      cursor: editing ? 'pointer' : 'default'
                    }
                  }}
                  onClick={() => editing && document.getElementById('profile-picture-upload').click()}
                >
                  {(!previewUrl && !user?.profilePicture) && (user?.name?.charAt(0)?.toUpperCase() || <PersonIcon fontSize="large" />)}
                </Avatar>
                {editing && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button 
                      variant="outlined" 
                      component="label"
                      size="small"
                      disabled={!editing || loading}
                    >
                      {previewUrl ? 'Change Photo' : 'Upload Photo'}
                      <input
                        id="profile-picture-upload"
                        type="file"
                        hidden
                        accept="image/*"
                        name="profilePicture"
                        onChange={handleChange}
                        disabled={!editing || loading}
                      />
                    </Button>
                    {previewUrl && (
                      <Button 
                        variant="text" 
                        color="error" 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData(prev => ({
                            ...prev,
                            profilePicture: null,
                            profilePictureUrl: ''
                          }));
                          setPreviewUrl('');
                        }}
                        disabled={loading}
                        sx={{ ml: 1 }}
                      >
                        Remove
                      </Button>
                    )}
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                      JPG, PNG (max 2MB)
                    </Typography>
                  </Box>
                )}
              </Box>
              {editing && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  sx={{ mt: 2 }}
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    InputProps={{
                      startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    multiline
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                {editing && (
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      disabled={loading}
                      fullWidth
                      size="large"
                    >
                      {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Account Security
          </Typography>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => navigate('/change-password')}
            sx={{ mr: 2 }}
          >
            Change Password
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            onClick={() => console.log('Delete account')}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
