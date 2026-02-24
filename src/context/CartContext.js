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

  const checkout = async () => {
    if (cartItems.length === 0) {
      return Promise.reject(new Error('Cart is empty'));
    }

    // Here you would typically make an API call to process the order
    // For now, we'll simulate the process
    return new Promise((resolve) => {
      setTimeout(() => {
        clearCart();
        resolve({ success: true, message: 'Checkout successful!' });
      }, 1000);
    });
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
    
    // If logged-in, sync cart from server but don't overwrite if local cart exists
    const syncFromServer = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await api.get('/api/cart', { headers: { Authorization: `Bearer ${token}` } });
        if (res?.data?.cart?.items) {
          const serverItems = res.data.cart.items.map(i => ({
            id: i.product_id, // Use product_id for client-side operations
            title: i.name || i.product?.name || i.product?.title || '',
            price: i.price,
            quantity: i.quantity
          }));
          
          // Only sync from server if local cart is empty (fresh login)
          const localCart = localStorage.getItem('cartItems');
          if (!localCart || JSON.parse(localCart).length === 0) {
            setCartItems(serverItems);
          }
        }
      } catch (err) {
        console.warn('Could not load server cart on mount', err);
      }
    };

    syncFromServer();
  }, []);

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
