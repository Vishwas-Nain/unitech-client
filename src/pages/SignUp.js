import React, { useEffect } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
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
          Create an Account
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Join us to get started
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 400, mt: 4 }}>
          {/* Placeholder for Sign Up form */}
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpPage;
