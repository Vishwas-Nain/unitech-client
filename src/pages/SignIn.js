import React, { useEffect } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        py: 4
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Sign in to your account to continue
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 400, mt: 4 }}>
          {/* Placeholder for Sign In form */}
        </Box>
      </Box>
    </Container>
  );
};

export default SignInPage;
