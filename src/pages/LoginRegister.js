import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  styled,
  useTheme,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Lock as LockIcon,
  Mail as MailIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { useAuth } from '../context/UserContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '20px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  maxWidth: '500px',
  margin: '0 auto',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  '& .MuiPaper-root': {
    backgroundColor: 'transparent',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minWidth: '120px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 700,
  },
  '&.MuiTab-root': {
    transition: 'color 0.3s ease',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.12)',
      borderRadius: '12px',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 0, 0, 0.1)',
  '& .MuiAlert-message': {
    fontSize: '0.9rem',
  },
}));

const LoginRegister = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [resetPasswordStep, setResetPasswordStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    mobile: '',
    otp: '',
    newPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { 
    login, 
    register, 
    requestPasswordReset, 
    verifyOTP, 
    resetPassword,
    resetError
  } = useAuth();
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setResetPasswordStep(0);
    setError('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      mobile: '',
      otp: '',
      newPassword: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const validateForm = () => {
    if (resetPasswordStep === 0) {
      if (activeTab === 0) { // Login
        if (!formData.email || !formData.password) {
          setError('Please fill in all fields');
          return false;
        }
        return true;
      } else { // Register
        if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name || !formData.mobile) {
          setError('Please fill in all fields');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (formData.mobile.length < 10) {
          setError('Please enter a valid mobile number');
          return false;
        }
        return true;
      }
    } else if (resetPasswordStep === 1) { // Enter mobile
      if (!formData.mobile || formData.mobile.length < 10) {
        setError('Please enter a valid mobile number');
        return false;
      }
      return true;
    } else if (resetPasswordStep === 2) { // Enter OTP
      if (!formData.otp) {
        setError('Please enter the OTP');
        return false;
      }
      return true;
    } else { // Reset password
      if (!formData.newPassword) {
        setError('Please enter your new password');
        return false;
      }
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      if (resetPasswordStep === 0) {
        if (activeTab === 0) { // Login
          const result = await login(formData.email, formData.password);
          if (result.success) {
            navigate('/');
          } else {
            setError(result.message);
          }
        } else { // Register
          const result = await register(formData.name, formData.email, formData.password, formData.mobile);
          if (result.success) {
            navigate('/');
          } else {
            setError(result.message);
          }
        }
      } else if (resetPasswordStep === 1) { // Request OTP
        const result = await requestPasswordReset(formData.mobile);
        if (!result.success) {
          setError(result.message);
        }
      } else if (resetPasswordStep === 2) { // Verify OTP
        const result = await verifyOTP(formData.otp);
        if (!result.success) {
          setError(result.message);
        }
      } else { // Reset password
        const result = await resetPassword(formData.newPassword);
        if (result.success) {
          setResetPasswordStep(0);
          setActiveTab(0);
        } else {
          setError(result.message);
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setResetPasswordStep(1);
    setActiveTab(0);
  };

  const handleBackToLogin = () => {
    setResetPasswordStep(0);
    setActiveTab(0);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: 'center',
          gap: 4,
        }}
      >
          {resetPasswordStep === 0 && (
            <>
              <StyledTypography
                variant="h3"
                component="h1"
                gutterBottom
                align="center"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #2563eb, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {activeTab === 0 ? 'Welcome Back' : 'Create Account'}
              </StyledTypography>
              <StyledTypography
                variant="h6"
                align="center"
                paragraph
                sx={{ mt: 2 }}
              >
                {activeTab === 0 ? 'Sign in to your account' : 'Join our community'}
              </StyledTypography>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  mb: 4,
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
              >
                <StyledTab label="Sign In" />
                <StyledTab label="Sign Up" />
              </Tabs>
            </>
          )}

          {resetPasswordStep === 1 && (
            <>
              <StyledTypography
                variant="h3"
                component="h1"
                gutterBottom
                align="center"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #2563eb, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Reset Password
              </StyledTypography>
              <StyledTypography
                variant="h6"
                align="center"
                paragraph
                sx={{ mt: 2 }}
              >
                Enter your mobile number to receive OTP
              </StyledTypography>
            </>
          )}

          {resetPasswordStep === 2 && (
            <>
              <StyledTypography
                variant="h3"
                component="h1"
                gutterBottom
                align="center"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #2563eb, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Verify OTP
              </StyledTypography>
              <StyledTypography
                variant="h6"
                align="center"
                paragraph
                sx={{ mt: 2 }}
              >
                Enter the OTP sent to {formData.mobile}
              </StyledTypography>
            </>
          )}

          {resetPasswordStep === 3 && (
            <>
              <StyledTypography
                variant="h3"
                component="h1"
                gutterBottom
                align="center"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #2563eb, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Set New Password
              </StyledTypography>
              <StyledTypography
                variant="h6"
                align="center"
                paragraph
                sx={{ mt: 2 }}
              >
                Enter your new password
              </StyledTypography>
            </>
          )}

          // ... (rest of the code remains the same)

          {resetPasswordStep === 0 && (
            <>
              <StyledTypography
                variant="h6"
                align="center"
                paragraph
                sx={{ mt: 4 }}
              >
                {activeTab === 0
                  ? "Don't have an account?"
                  : 'Already have an account?'}{' '}
                <StyledButton
                  color="primary"
                  size="small"
                  onClick={() => handleTabChange(null, activeTab === 0 ? 1 : 0)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    color: 'black',
                  }}
                >
                  {activeTab === 0 ? 'Sign Up' : 'Sign In'}
                </StyledButton>
              </StyledTypography>
              {/* Forgot Password Link */}
              {activeTab === 0 && (
                <StyledButton
                  color="primary"
                  size="small"
                  sx={{ mt: 1, color: 'black', textTransform: 'none', fontWeight: 600 }}
                  onClick={() => {
                    setResetPasswordStep(1);
                    setError('');
                    setFormData(f => ({ ...f, mobile: '', otp: '', newPassword: '' }));
                  }}
                >
                  Forgot Password?
                </StyledButton>
              )}
            </>
          )}

          {/* Forgot Password Step 1: Enter Mobile */}
          {resetPasswordStep === 1 && (
            <>
              <StyledTextField
                fullWidth
                label="Mobile Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ pattern: '[0-9]*', maxLength: 10 }}
                sx={{ input: { color: 'black' } }}
              />
              <StyledButton
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, color: 'black' }}
                disabled={loading}
                onClick={async () => {
                  setError('');
                  if (!formData.mobile || formData.mobile.length !== 10) {
                    setError('Enter a valid 10-digit mobile number');
                    return;
                  }
                  setLoading(true);
                  // Mock sending OTP
                  setTimeout(() => {
                    setLoading(false);
                    setResetPasswordStep(2);
                  }, 1000);
                  // TODO: Replace with real API call
                }}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </StyledButton>
              <StyledButton
                fullWidth
                color="secondary"
                sx={{ mt: 2, color: 'black' }}
                onClick={() => {
                  setResetPasswordStep(0);
                  setError('');
                }}
              >
                Back to Login
              </StyledButton>
            </>
          )}

          {/* Forgot Password Step 2: Enter OTP */}
          {resetPasswordStep === 2 && (
            <>
              <StyledTextField
                fullWidth
                label="OTP"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ input: { color: 'black' } }}
              />
              <StyledButton
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, color: 'black' }}
                disabled={loading}
                onClick={async () => {
                  setError('');
                  if (!formData.otp || formData.otp.length < 4) {
                    setError('Enter the OTP sent to your mobile');
                    return;
                  }
                  setLoading(true);
                  // Mock OTP verification
                  setTimeout(() => {
                    setLoading(false);
                    setResetPasswordStep(3);
                  }, 1000);
                  // TODO: Replace with real API call
                }}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </StyledButton>
              <StyledButton
                fullWidth
                color="secondary"
                sx={{ mt: 2, color: 'black' }}
                onClick={() => {
                  setResetPasswordStep(1);
                  setError('');
                }}
              >
                Back
              </StyledButton>
            </>
          )}

          {/* Forgot Password Step 3: Set New Password */}
          {resetPasswordStep === 3 && (
            <>
              <StyledTextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ input: { color: 'black' } }}
              />
              <StyledButton
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, color: 'black' }}
                disabled={loading}
                onClick={async () => {
                  setError('');
                  if (!formData.newPassword || formData.newPassword.length < 6) {
                    setError('Password must be at least 6 characters');
                    return;
                  }
                  setLoading(true);
                  // Mock password reset
                  setTimeout(() => {
                    setLoading(false);
                    setResetPasswordStep(0);
                    setError('Password reset successful! Please login.');
                  }, 1000);
                  // TODO: Replace with real API call
                }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </StyledButton>
              <StyledButton
                fullWidth
                color="secondary"
                sx={{ mt: 2, color: 'black' }}
                onClick={() => {
                  setResetPasswordStep(0);
                  setError('');
                }}
              >
                Back to Login
              </StyledButton>
            </>
          )}

        </StyledPaper>
      </Box>
    </Container>
  );
};

export default LoginRegister;
