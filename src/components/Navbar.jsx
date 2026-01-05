import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParking } from '../ParkingContext';
import { LogOut, User, CarFront, Cctv } from 'lucide-react';

export default function Navbar() {
  const { logout } = useParking();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="logo">🅿️</span>
        <span className="brand-name">SmartPark</span>
      </div>
      
      <div className="nav-links">
        <Link to="/dashboard" className="nav-item">
          < Cctv size={20} />
          <span className="link-text">Dashboard</span>
        </Link>

        <Link to="/dashboard" className="nav-item">
          <CarFront size={20} />
          <span className="link-text">Dashboard</span>
        </Link>
        
        <Link to="/profile" className="nav-item">
          <User size={20} />
          <span className="link-text">Profile</span>
        </Link>
        
        <button onClick={handleLogout} className="nav-item btn-logout" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}