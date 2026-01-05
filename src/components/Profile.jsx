import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParking } from '../ParkingContext';
import { Car, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const { user, vehicle, updateProfile } = useParking();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '',
    vehicle_name: '', vehicle_plate: '', vehicle_type: '4-wheeler'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name, phone: user.phone, email: user.email,
        vehicle_name: vehicle?.model || '',
        vehicle_plate: vehicle?.plate || '',
        vehicle_type: vehicle?.type || '4-wheeler'
      });
    }
  }, [user, vehicle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(
      { name: formData.name, phone: formData.phone, email: formData.email },
      { model: formData.vehicle_name, plate: formData.vehicle_plate, type: formData.vehicle_type }
    );
    navigate('/dashboard');
  };

  // Generate QR URL
  const qrValue = vehicle?.plate ? `${vehicle.plate}-${user?.phone}` : "NO-DATA";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrValue}&bgcolor=ffffff`;

  return (
    <div className="page-container">
      {/* Digital Pass Card */}
      {vehicle && (
        <div className="digital-pass">
          <div className="pass-header">
            <span>🅿️ ACCESS PASS</span>
            <span className="verified-badge"><ShieldCheck size={14}/> Verified</span>
          </div>
          <div className="qr-container">
             <img src={qrUrl} alt="QR Code" className="qr-image" />
             <p className="scan-instruction">Scan at Gate</p>
          </div>
          <div className="pass-details">
            <div className="detail-row">
              <span className="label">Vehicle</span>
              <span className="value">{vehicle.model}</span>
            </div>
            <div className="detail-row">
              <span className="label">Plate</span>
              <span className="plate-tag">{vehicle.plate}</span>
            </div>
          </div>
        </div>
      )}

      <h3>Edit Profile</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Driver Details</label>
          <input placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
        </div>

        <div className="form-group">
          <label>Vehicle Details</label>
          <input placeholder="Vehicle Model (e.g. Honda City)" value={formData.vehicle_name} onChange={e => setFormData({...formData, vehicle_name: e.target.value})} required />
          <input placeholder="Plate Number (e.g. KA-01-AB-1234)" value={formData.vehicle_plate} onChange={e => setFormData({...formData, vehicle_plate: e.target.value})} required />
          <select value={formData.vehicle_type} onChange={e => setFormData({...formData, vehicle_type: e.target.value})}>
            <option value="4-wheeler">4-Wheeler</option>
            <option value="2-wheeler">2-Wheeler</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">Save & Go to Dashboard</button>
      </form>
    </div>
  );
}