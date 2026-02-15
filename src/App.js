import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme/theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Blog from './pages/Blog';
import Orders from './pages/Orders';
import Order from './pages/Order';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import { UserProvider, useUser } from './context/UserContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Box component="main" sx={{ flexGrow: 1, minHeight: 'calc(100vh - 64px - 64px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/blog" element={<Blog />} />
          
          {/* Protected Routes */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout/success" 
            element={
              <ProtectedRoute>
                <CheckoutSuccess />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/change-password" 
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders/:id" 
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Auth Routes */}
          <Route path="/login" element={
            <GuestOnlyRoute>
              <Login />
            </GuestOnlyRoute>
          } />
          <Route path="/register" element={
            <GuestOnlyRoute>
              <Register />
            </GuestOnlyRoute>
          } />
          
          {/* Catch-all route */}
          <Route 
            path="*" 
            element={
              <Box sx={{ padding: '2rem', textAlign: 'center' }}>
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
              </Box>
            } 
          />
        </Routes>
      </Box>
      <Footer />
    </>
  );
};

// A wrapper for routes that should only be accessible to guests (not logged in users)
const GuestOnlyRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();
  const isExplicitNavigation = location.state?.from === 'navbar';

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Only redirect if the user is logged in and this isn't an explicit navigation from the navbar
  if (isLoggedIn && !isExplicitNavigation) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <AppRoutes />
            </Router>
          </CartProvider>
        </AuthProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
