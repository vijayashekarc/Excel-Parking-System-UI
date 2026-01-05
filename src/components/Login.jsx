import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParking } from '../ParkingContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const { login } = useParking();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login({ email });
    // Go to profile first to set up car, or dashboard if already set
    navigate('/profile'); 
  };

  return (
    <div className="login-container">
      <div className="card">
        <div style={{textAlign: 'center', marginBottom: '20px', fontSize: '3rem'}}>🅿️</div>
        <h2 style={{textAlign: 'center'}}>Welcome Driver</h2>
        <p style={{textAlign: 'center', color: '#64748b', marginBottom: '30px'}}>Enter your credentials to access the Smart Parking System.</p>
        
        <form onSubmit={handleLogin}>
          <input 
            type="text" placeholder="Username / Email" 
            value={email} onChange={e => setEmail(e.target.value)} required 
          />
          <input type="password" placeholder="Password (Any)" required />
          <button type="submit" className="btn-primary">Login Securely</button>
        </form>
      </div>
    </div>
  );
}