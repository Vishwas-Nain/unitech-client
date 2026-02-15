import axios from "axios";

console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true, // Important for cookies/sessions
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
});

// Request interceptor to log all requests
api.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method.toUpperCase(), config.url);
    if (config.data) {
      console.log('Request data:', config.data);
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      method: response.config.method.toUpperCase(),
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', {
        url: error.config.url,
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', {
        url: error.config?.url,
        request: error.request
      });
      error.message = 'No response from server. Please check your connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', {
        message: error.message,
        config: error.config
      });
    }
    return Promise.reject(error);
  }
);

export default api;

export async function registerUser(data) {
  try {
    console.log('Attempting to register user with data:', data);
    
    const response = await api.post('/api/users/register', data);
    console.log('Registration successful:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Registration failed:', error);
    return { 
      error: error.response?.data?.message || 
             error.message || 
             'Failed to register. Please try again.' 
    };
  }
}

export async function loginUser(data) {
  try {
    console.log('Attempting to login with data:', {
      email: data.email,
      hasPassword: !!data.password,
      hasOtp: !!data.otp,
      hasUserId: !!data.userId,
      data: { ...data, password: data.password ? '[HIDDEN]' : undefined }
    });
    
    const response = await api.post('/api/users/login', data);
    
    // Enhanced response logging
    console.log('Login response received:', {
      status: response.status,
      data: {
        ...response.data,
        token: response.data.token ? '[TOKEN_RECEIVED]' : 'No token',
        user: response.data.user ? 'User data received' : 'No user data'
      },
      requiresOtp: response.data.requiresOtp,
      headers: response.headers
    });
    
    // Ensure consistent response format
    return {
      ...response.data,
      success: !response.data.error,
      requiresOtp: response.data.requiresOtp || false,
      userId: response.data.userId || null
    };
    
  } catch (error) {
    console.error('Login failed:', {
      message: error.message,
      response: {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      },
      request: error.request ? 'Request was made but no response received' : undefined
    });
    
    return { 
      error: error.response?.data?.message || 
             error.message || 
             'Failed to login. Please try again.' 
    };
  }
}
