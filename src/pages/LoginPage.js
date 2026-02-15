import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Forgot password state
  const [forgotStep, setForgotStep] = useState(0); // 0=hidden, 1=mobile, 2=otp, 3=new password
  const [forgotData, setForgotData] = useState({ mobile: '', otp: '', newPassword: '' });
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 4,
          py: 8,
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{
              color: 'black',
              fontWeight: 700,
              mb: 3,
            }}
          >
            Welcome Back
          </Typography>

          <Typography 
            variant="body1" 
            align="center" 
            color="text.secondary"
            sx={{ mb: 4, opacity: 0.9, color: 'black' }}
          >
            Sign in to continue to Unitech Computers
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: 1,
                bgcolor: 'error.light',
                color: 'error.main',
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
              sx={{
                input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                input: { color: 'black' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2,
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'black',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Logging in...</span>
                </Box>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ opacity: 0.8, color: 'black' }}
            >
              Don't have an account?
            </Typography>
            <Link 
              href="/register" 
              color="primary"
              sx={{
                textDecoration: 'none',
                fontWeight: 600,
                color: 'black',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Register
            </Link>
          </Box>

          {/* Forgot Password Section */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              color="primary"
              size="small"
              sx={{ color: 'black', textTransform: 'none', fontWeight: 600 }}
              onClick={() => {
                setForgotStep(1);
                setForgotError('');
                setForgotData({ mobile: '', otp: '', newPassword: '' });
              }}
            >
              Forgot Password?
            </Button>
          </Box>

          {/* Forgot Password Flow */}
          {forgotStep > 0 && (
            <Box sx={{ mt: 4, p: 3, borderRadius: 2, background: 'rgba(240,240,240,0.95)', boxShadow: 2 }}>
              {forgotStep === 1 && (
                <>
                  <Typography variant="h6" align="center" sx={{ fontWeight: 700, color: 'black', mb: 2 }}>
                    Reset Password
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ color: 'black', mb: 2 }}>
                    Enter your registered mobile number to receive OTP
                  </Typography>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobile"
                    value={forgotData.mobile}
                    onChange={e => setForgotData({ ...forgotData, mobile: e.target.value })}
                    margin="normal"
                    required
                    inputProps={{ pattern: '[0-9]*', maxLength: 10 }}
                    sx={{ input: { color: 'black' } }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, color: 'black' }}
                    disabled={forgotLoading}
                    onClick={async () => {
                      setForgotError('');
                      if (!forgotData.mobile || forgotData.mobile.length !== 10) {
                        setForgotError('Enter a valid 10-digit mobile number');
                        return;
                      }
                      setForgotLoading(true);
                      setTimeout(() => {
                        setForgotLoading(false);
                        setForgotStep(2);
                      }, 1000);
                      // TODO: Replace with real API call
                    }}
                  >
                    {forgotLoading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                  <Button
                    fullWidth
                    color="secondary"
                    sx={{ mt: 2, color: 'black' }}
                    onClick={() => {
                      setForgotStep(0);
                      setForgotError('');
                    }}
                  >
                    Back to Login
                  </Button>
                </>
              )}
              {forgotStep === 2 && (
                <>
                  <Typography variant="h6" align="center" sx={{ fontWeight: 700, color: 'black', mb: 2 }}>
                    Verify OTP
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ color: 'black', mb: 2 }}>
                    Enter the OTP sent to {forgotData.mobile}
                  </Typography>
                  <TextField
                    fullWidth
                    label="OTP"
                    name="otp"
                    value={forgotData.otp}
                    onChange={e => setForgotData({ ...forgotData, otp: e.target.value })}
                    margin="normal"
                    required
                    sx={{ input: { color: 'black' } }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, color: 'black' }}
                    disabled={forgotLoading}
                    onClick={async () => {
                      setForgotError('');
                      if (!forgotData.otp || forgotData.otp.length < 4) {
                        setForgotError('Enter the OTP sent to your mobile');
                        return;
                      }
                      setForgotLoading(true);
                      setTimeout(() => {
                        setForgotLoading(false);
                        setForgotStep(3);
                      }, 1000);
                      // TODO: Replace with real API call
                    }}
                  >
                    {forgotLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <Button
                    fullWidth
                    color="secondary"
                    sx={{ mt: 2, color: 'black' }}
                    onClick={() => {
                      setForgotStep(1);
                      setForgotError('');
                    }}
                  >
                    Back
                  </Button>
                </>
              )}
              {forgotStep === 3 && (
                <>
                  <Typography variant="h6" align="center" sx={{ fontWeight: 700, color: 'black', mb: 2 }}>
                    Set New Password
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ color: 'black', mb: 2 }}>
                    Enter your new password
                  </Typography>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={forgotData.newPassword}
                    onChange={e => setForgotData({ ...forgotData, newPassword: e.target.value })}
                    margin="normal"
                    required
                    sx={{ input: { color: 'black' } }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, color: 'black' }}
                    disabled={forgotLoading}
                    onClick={async () => {
                      setForgotError('');
                      if (!forgotData.newPassword || forgotData.newPassword.length < 6) {
                        setForgotError('Password must be at least 6 characters');
                        return;
                      }
                      setForgotLoading(true);
                      setTimeout(() => {
                        setForgotLoading(false);
                        setForgotStep(0);
                        setForgotError('Password reset successful! Please login.');
                      }, 1000);
                      // TODO: Replace with real API call
                    }}
                  >
                    {forgotLoading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                  <Button
                    fullWidth
                    color="secondary"
                    sx={{ mt: 2, color: 'black' }}
                    onClick={() => {
                      setForgotStep(0);
                      setForgotError('');
                    }}
                  >
                    Back to Login
                  </Button>
                </>
              )}
              {forgotError && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 1, bgcolor: 'error.light', color: 'error.main' }}>
                  {forgotError}
                </Alert>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
