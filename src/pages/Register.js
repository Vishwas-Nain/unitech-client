import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Alert,
  Paper
} from '@mui/material';
import { registerUser } from '../api/api';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Basic validation
      if (!form.name || !form.email || !form.password || !form.mobile) {
        throw new Error('Please fill in all fields');
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (form.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Mobile validation (assuming 10-digit Indian mobile number)
      if (!/^[6-9]\d{9}$/.test(form.mobile.replace(/[-\s]/g, ''))) {
        throw new Error('Please enter a valid 10-digit mobile number');
      }

      console.log('Attempting to register user...');
      const response = await registerUser(form);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      console.log('Registration successful, redirecting to login...');
      // Show success message before redirect
      setError('Registration successful! Redirecting to login...');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { state: { registrationSuccess: true } });
      }, 1500);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Get started with Unitech Computers
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={form.name}
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="mobile"
              label="Mobile Number"
              name="mobile"
              type="tel"
              autoComplete="tel"
              placeholder="Enter 10-digit mobile number"
              value={form.mobile}
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !form.name || !form.email || !form.password || !form.mobile}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Typography align="center">
              Already have an account?{' '}
              <Link href="/login" variant="body2">
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
