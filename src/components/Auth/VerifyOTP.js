import React, { useState } from 'react';
import api from '../../api/api';
import { saveToken } from '../../utils/auth';

const VerifyOTP = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    saveToken(res.data.token);
    alert('Login success!');
  };

  return (
    <div>
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <input type="text" onChange={(e) => setOtp(e.target.value)} />
      <button onClick={handleVerify}>Verify OTP</button>
    </div>
  );
};

export default VerifyOTP;
