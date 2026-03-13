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
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [userId, setUserId] = useState(null);
  
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

  const handleSendOtp = async () => {
    if (!formData.email || !formData.password) {
      setError('Please enter email and password first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Login - Sending OTP for:', formData.email);

      const response = await loginUser({
        email: formData.email,
        password: formData.password,
        sendOtp: true
      });
      
      console.log('Login - Send OTP response:', response);

      if (response.requiresOtp) {
        console.log('Login - OTP sent, userId:', response.userId);
        setUserId(response.userId);
        setShowOtpField(true);
        setOtpSent(true);
        setOtpCountdown(60);
        setSuccess('OTP has been sent to your email address');
        setFormData(prev => ({ ...prev, otp: '' }));
      } else if (response.error) {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Login - Verifying OTP for:', formData.email);

      const result = await login(
        formData.email, 
        formData.password,
        formData.otp,
        userId
      );

      console.log('Login - Verification result:', result);

      if (result.success) {
        console.log('Login - Successful, navigating to home');
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else if (result.error) {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || 'OTP verification failed. Please try again.');
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
        setSuccess('New OTP sent to your email address');
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

          <Box component="form" sx={{ mt: 1 }}>
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

            {/* Send OTP Button - Only show before OTP is sent */}
            {!otpSent && (
              <Button
                type="button"
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
                disabled={loading || !formData.email || !formData.password}
                onClick={handleSendOtp}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Send OTP'
                )}
              </Button>
            )}

            {/* OTP Field and Verify Button - Only show after OTP is sent */}
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
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={loading || !formData.otp}
                    variant="contained"
                    sx={{ flex: 1 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Verify OTP'
                    )}
                  </Button>
                  <Button
                    onClick={handleResendOtp}
                    disabled={otpCountdown > 0 || loading}
                    size="small"
                    color="primary"
                    variant="outlined"
                  >
                    {otpCountdown > 0 
                      ? `Resend ${otpCountdown}s` 
                      : 'Resend'}
                  </Button>
                </Box>
              </Box>
            )}
            
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
