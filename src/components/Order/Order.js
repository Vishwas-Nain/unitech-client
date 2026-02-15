import React from 'react';
import api from '../../api/api';
import { getToken } from '../../utils/auth';

const Order = ({ user_id, items, total }) => {
  const placeOrder = async () => {
    const res = await api.post(
      '/order/place',
      { user_id, items, total },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    alert('Order placed!');
  };

  return (
    <div>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default Order;
