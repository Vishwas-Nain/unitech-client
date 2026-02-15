import React, { useState } from 'react';
import api from '../../api/api';
import { getToken } from '../../utils/auth';

const Cart = () => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const addToCart = async () => {
    const res = await api.post(
      '/cart/add',
      {
        user_id: 'user_id_here', // ideally from user context
        product_id: productId,
        quantity
      },
      {
        headers: { Authorization: `Bearer ${getToken()}` }
      }
    );
    alert(res.data.message);
  };

  return (
    <div>
      <input placeholder="Product ID" onChange={(e) => setProductId(e.target.value)} />
      <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
};

export default Cart;
