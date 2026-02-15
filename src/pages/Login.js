import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  IconButton,
  Collapse
} from '@mui/material';
import { loginUser } from '../api/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { Visibility, VisibilityOff, Sms } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpField, setShowOtpField] = useState(() => {
    // Try to get userId from localStorage on initial load
    const storedUserId = localStorage.getItem('otp_user_id');
    return storedUserId ? true : false;
  });
  const [otpSent, setOtpSent] = useState(() => {
    // Try to get userId from localStorage on initial load
    const storedUserId = localStorage.getItem('otp_user_id');
    return storedUserId ? true : false;
  });
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [userId, setUserId] = useState(() => {
    // Try to get userId from localStorage on initial load
    const storedUserId = localStorage.getItem('otp_user_id');
    return storedUserId ? storedUserId : null;
  });
  
  // Check for registration success state
  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setSuccess('Registration successful! Please log in.');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Handle OTP countdown
  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Login - Attempting login with data:', {
        email: formData.email,
        hasOtp: !!formData.otp,
        userId: userId || 'none'
      });

      // Call the login function from AuthContext
      const result = await login(
        formData.email, 
        formData.password,
        formData.otp || undefined, // Only send OTP if it exists
        userId || undefined         // Only send userId if it exists
      );

      console.log('Login - Login result:', result);

      // Handle OTP required case
      if (result.requiresOtp) {
        console.log('Login - OTP required, userId:', result.userId);
        // Store the userId in localStorage to persist across page refreshes
        if (result.userId) {
          localStorage.setItem('otp_user_id', result.userId);
        }
        
        // Update state to show OTP field
        setShowOtpField(true);
        setOtpSent(true);
        setOtpCountdown(60);
        setUserId(prevUserId => result.userId || prevUserId);
        setSuccess('OTP has been sent to your registered mobile number');
        setFormData(prev => ({ ...prev, otp: '' })); // Clear OTP field
        setLoading(false);
        return;
      }

      // If there was an error
      if (result.error) {
        throw new Error(result.error);
      }

      // If login was successful
      if (result.success) {
        console.log('Login - Successful, navigating to home');
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
        return;
      }

      // If we get here, something unexpected happened
      console.error('Login - Unexpected response format:', result);
      throw new Error('Unexpected response from server');
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         (otpSent ? 'Verification failed' : 'Login failed') + '. Please try again.';
      setError(errorMessage);
      
      // If OTP was sent but verification failed, keep the OTP field visible
      if (otpSent) {
        setShowOtpField(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpCountdown > 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
        resendOtp: true
      });
      
      if (response.requiresOtp) {
        setOtpCountdown(60);
        setSuccess('New OTP sent to your mobile number');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
            {otpSent ? 'Verify OTP' : 'Sign In'}
          </Typography>
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField 
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus={!otpSent}
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              sx={{ input: { color: 'black' } }}
            />
            
            <TextField 
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{ input: { color: 'black' } }}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />

            {showOtpField && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="otp"
                  label="Enter OTP"
                  type="text"
                  id="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  autoFocus
                  sx={{ input: { color: 'black' } }}
                  InputProps={{
                    startAdornment: <Sms color="action" sx={{ mr: 1 }} />,
                  }}
                />
                <Box sx={{ textAlign: 'right', mt: 1 }}>
                  <Button
                    onClick={handleResendOtp}
                    disabled={otpCountdown > 0 || loading}
                    size="small"
                    color="primary"
                  >
                    {otpCountdown > 0 
                      ? `Resend OTP in ${otpCountdown}s` 
                      : 'Resend OTP'}
                  </Button>
                </Box>
              </Box>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
              disabled={loading || 
                (otpSent && !formData.otp) || 
                (!otpSent && (!formData.email || !formData.password))}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : otpSent ? (
                'Verify OTP'
              ) : (
                'Sign In'
              )}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Button
              fullWidth
              variant="outlined"
              sx={{ 
                mb: 2, 
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark'
                }
              }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </Button>

            <Typography align="center" sx={{ color: 'text.primary' }}>
              Don't have an account?{' '}
              <Link 
                href="/register" 
                variant="body2" 
                sx={{ 
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
