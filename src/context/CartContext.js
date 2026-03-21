import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { getToken } from '../utils/auth';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const addToCart = async (product, quantity = 1) => {
    const token = getToken();

    // If user is logged in, persist to server and sync
    if (token) {
      try {
        await api.post('/api/cart/items', {
          productId: product._id || product.id,
          quantity
        }, { headers: { Authorization: `Bearer ${token}` } });

        // Don't refetch entire cart - update locally
        const existingItem = cartItems.find(item => item.id === (product._id || product.id));
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          setCartItems(prev => 
            prev.map(item => 
              item.id === (product._id || product.id) 
                ? { ...item, quantity: newQuantity } 
                : item
            )
          );
        } else {
          setCartItems(prev => [...prev, { 
            id: product._id || product.id, 
            title: product.name || product.title, 
            price: product.price, 
            quantity 
          }]);
        }
        updateTotalPrice();
        return;
      } catch (err) {
        console.error('Failed to sync cart with server, falling back to local cart', err);
        // fallthrough to local update
      }
    }

    // Fallback: local-only cart (for guests or on error)
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity <= 0) {
        removeFromCart(product.id);
      } else {
        setCartItems(prev => 
          prev.map(item => 
            item.id === product.id 
              ? { ...item, quantity: newQuantity } 
              : item
          )
        );
      }
    } else {
      setCartItems(prev => [...prev, { ...product, quantity }]);
    }
    updateTotalPrice();
  };

  const removeFromCart = (productId) => {
    const token = getToken();

    // Optimistic update: remove locally immediately
    const prevItems = cartItems;
    const updatedItems = prevItems.filter(item => item.id !== productId);
    setCartItems(updatedItems);
    setTotalPrice(updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0));

    if (token) {
      // call server to remove; on failure revert
      api.delete(`/api/cart/items/${productId}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          // Don't refetch entire cart - trust the optimistic update
          console.log('Item removed from server cart successfully');
        })
        .catch(err => {
          console.error('Failed to remove from server cart — reverting optimistic update', err);
          setCartItems(prevItems);
          setTotalPrice(prevItems.reduce((t, it) => t + (it.price * it.quantity), 0));
        });
      return;
    }

    // If not authenticated, localStorage will be updated by effect
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const token = getToken();

    // Optimistic update: apply locally immediately
    const prevItems = cartItems;
    const updatedItems = prevItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    setTotalPrice(updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0));

    if (token) {
      api.put(`/api/cart/items/${productId}`, { quantity: newQuantity }, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          // Don't refetch entire cart - trust the optimistic update
          console.log('Item quantity updated on server successfully');
        })
        .catch(err => {
          console.error('Failed to update quantity on server — reverting optimistic update', err);
          setCartItems(prevItems);
          setTotalPrice(prevItems.reduce((t, it) => t + (it.price * it.quantity), 0));
        });
      return;
    }
  };

  const clearCart = () => {
    const token = getToken();

    // Optimistic: clear locally first
    const prevItems = cartItems;
    setCartItems([]);
    setTotalPrice(0);

    if (token) {
      api.delete('/api/cart', { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          // server cleared successfully
        })
        .catch(err => {
          console.error('Failed to clear server cart — reverting optimistic clear', err);
          setCartItems(prevItems);
          setTotalPrice(prevItems.reduce((t, it) => t + (it.price * it.quantity), 0));
        });
      return;
    }

    localStorage.removeItem('cartItems');
  };

  const checkout = async (shippingAddress, paymentMethod) => {
    if (cartItems.length === 0) {
      return Promise.reject(new Error('Cart is empty'));
    }

    const token = getToken();
    if (!token) {
      return Promise.reject(new Error('Please login to checkout'));
    }

    try {
      const response = await api.post('/api/orders', {
        shippingAddress,
        paymentMethod
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Clear cart after successful order
        clearCart();
        return { success: true, message: 'Order placed successfully!' };
      } else {
        return { success: false, message: response.data.message || 'Checkout failed' };
      }
    } catch (error) {
      console.error('Checkout error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to place order' 
      };
    }
  };

  const updateTotalPrice = () => {
    setTotalPrice(
      cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    );
  };

  useEffect(() => {
    // Load cart from localStorage first
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    
    // If logged-in, sync cart with server
    const syncCart = async () => {
      const token = getToken();
      if (!token) {
        // Clear cart if no token (user logged out)
        setCartItems([]);
        localStorage.removeItem('cartItems');
        return;
      }
      
      try {
        // Get server cart first
        const res = await api.get('/api/cart', { headers: { Authorization: `Bearer ${token}` } });
        
        if (res?.data?.cart?.items) {
          const serverItems = res.data.cart.items.map(i => ({
            id: i.product_id, // Use product_id for client-side operations
            title: i.name || i.product?.name || i.product?.title || '',
            price: i.price,
            quantity: i.quantity
          }));
          
          setCartItems(serverItems);
          console.log('✅ Cart loaded from server:', { itemsCount: serverItems.length });
        } else {
          console.log('🛒 No cart on server, using local cart');
        }
      } catch (err) {
        console.warn('Could not sync cart with server', err);
        // If auth error, clear cart
        if (err.response?.status === 401) {
          setCartItems([]);
          localStorage.removeItem('cartItems');
        }
      }
    };
    
    syncCart();
  }, []); // Empty dependency array means this runs only once on mount to localStorage

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateTotalPrice();
  }, [cartItems]);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        totalPrice, 
        addToCart, 
        removeFromCart, 
        updateQuantity,
        clearCart,
        checkout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
