import React, { useState } from 'react';
import { registerUser } from '../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'producer'
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      console.log('Registration successful:', response);
      
      // Save token
      localStorage.setItem('token', response.token);
      
      // Show success message
      setMessage(`Success! Your blockchain address: ${response.user.blockchainAddress}`);
      
      // Redirect or do something else
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <input 
        type="email" 
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <input 
        type="password" 
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />
      <select 
        value={formData.role}
        onChange={(e) => setFormData({...formData, role: e.target.value})}
      >
        <option value="producer">Producer</option>
        <option value="market">Market</option>
        <option value="retail">Retail</option>
        <option value="consumer">Consumer</option>
      </select>
      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default RegisterPage;