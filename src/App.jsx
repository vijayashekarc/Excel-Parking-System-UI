import './App.css';  // 👈 THIS LINE IS MISSING. ADD IT HERE.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ParkingProvider, useParking } from './ParkingContext';
import Login from './components/Login';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
// Layout wrapper that protects routes and adds Navbar
const PrivateLayout = ({ children }) => {
  const { user } = useParking();
  if (!user) return <Navigate to="/" />;
  return (
    <>
      <Navbar />
      <div className="main-content">
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <ParkingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<PrivateLayout><Profile /></PrivateLayout>} />
          <Route path="/dashboard" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
        </Routes>
      </BrowserRouter>
    </ParkingProvider>
  );
}

export default App;