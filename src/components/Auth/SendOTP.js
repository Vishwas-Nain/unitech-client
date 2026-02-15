import React, { useState } from 'react';
import api from '../../api/api';

const SendOTP = () => {
  const [email, setEmail] = useState('');

  const handleSend = async () => {
    await api.post('/auth/send-otp', { email });
    alert('OTP sent!');
  };

  return (
    <div>
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleSend}>Send OTP</button>
    </div>
  );
};

export default SendOTP;
