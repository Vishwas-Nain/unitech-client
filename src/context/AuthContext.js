import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otpUserId, setOtpUserId] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsLoggedIn(true);
          console.log('AuthContext - User authenticated on load:', userData.email);
        } else {
          console.log('AuthContext - No valid session found');
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Error checking auth state:', err);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);
  
  // Debug effect to log auth state changes
  useEffect(() => {
    console.log('Auth state updated - isLoggedIn:', isLoggedIn, 'User:', user);
  }, [isLoggedIn, user]);

  // Login function
  const login = async (email, password, otp, userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const requestData = { email, password };
      if (otp) requestData.otp = otp;
      if (userId) requestData.userId = userId;
      
      console.log('AuthContext - Sending login request with data:', { 
        email, 
        hasOtp: !!otp, 
        userId: userId || 'none' 
      });
      
      const response = await loginUser(requestData);
      console.log('AuthContext - Login response:', response);
      
      if (response.error) {
        // If there's an error but we have requiresOtp, handle OTP flow
        if (response.requiresOtp) {
          console.log('AuthContext - OTP required (from error response), userId:', response.userId);
          setRequiresOtp(true);
          setOtpUserId(response.userId);
          return { 
            requiresOtp: true, 
            userId: response.userId,
            message: response.message || 'OTP required'
          };
        }
        throw new Error(response.error);
      }

      // Handle OTP required case
      if (response.requiresOtp || response.status === 'otp_required') {
        console.log('AuthContext - OTP required, userId:', response.userId || userId);
        setRequiresOtp(true);
        setOtpUserId(response.userId || userId);
        return { 
          requiresOtp: true, 
          userId: response.userId || userId,
          message: response.message || 'OTP required'
        };
      }

      // If login is successful
      if (response.token) {
        console.log('AuthContext - Login successful, setting user data');
        setUser(response.user);
        setIsLoggedIn(true);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { 
          success: true, 
          user: response.user,
          message: 'Login successful'
        };
      }

      console.error('AuthContext - Invalid response format:', response);
      throw new Error('Invalid response from server');
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await registerUser(userData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return { 
        success: true, 
        message: response.message || 'Registration successful!',
        requiresOtp: response.requiresOtp,
        userId: response.userId
      };
    } catch (err) {
      setError(err.message || 'Registration failed');
      return { 
        success: false, 
        message: err.message || 'Registration failed' 
      };
    } finally {
    }
  };

  // Logout function
  const logout = () => {
    console.log('AuthContext - Logging out user');
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setOtpUserId(null);
    setRequiresOtp(false);
    return { success: true };
  };

  // Update user data
  const updateUser = (updatedUserData) => {
    console.log('AuthContext - Updating user data:', updatedUserData);
    try {
      // Merge the updated data with existing user data
      const updatedUser = { ...user, ...updatedUserData };
      
      // Update the state
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      console.log('AuthContext - User data updated successfully');
      return { success: true, user: updatedUser };
    } catch (err) {
      console.error('Error updating user data:', err);
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoggedIn, 
        loading, 
        error, 
        login, 
        register, 
        logout,
        updateUser
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
