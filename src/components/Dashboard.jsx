import React, { useState } from 'react';
import { useParking } from '../ParkingContext';
import { Car, ArrowDown } from 'lucide-react';

export default function Dashboard() {
  const { parkingData, autoAllocateSpot, activeTicket, exitParking, user, vehicle } = useParking();
  const [showPayment, setShowPayment] = useState(false);
  const [cost, setCost] = useState(0);

  const handlePark = () => {
    if (!vehicle) return alert("Please add vehicle details in Profile first!");
    const spot = autoAllocateSpot();
    if (!spot) alert("Sorry! Parking is fully occupied.");
  };

  const handleExit = () => {
    // Fake logic: $5 base + random
    setCost(5 + Math.floor(Math.random() * 15));
    setShowPayment(true);
  };

  const processPayment = () => {
    setShowPayment(false);
    exitParking();
    alert("Payment Successful! Gate Opening...");
  };

  // Helper to render spots
  const renderSpot = (spot, floorIndex, rowIndex, colIndex) => {
    const isMyCar = activeTicket && 
                    activeTicket.floor === floorIndex && 
                    activeTicket.row === rowIndex && 
                    activeTicket.col === colIndex;

    return (
      <div 
        key={spot.id} 
        className={`spot ${spot.occupied ? 'occupied' : 'free'} ${isMyCar ? 'my-car' : ''}`}
      >
        {isMyCar ? <Car size={18} color="white" /> : (spot.occupied ? null : <span className="spot-id">{colIndex + 1}</span>)}
      </div>
    );
  };

  return (
    <div className="dashboard">
      <header>
        <div className="header-text">
          <h1>Dashboard</h1>
          <p className="subtitle">Hello, {user?.name}</p>
        </div>
        <div className="vehicle-badge">
          <Car size={16} />
          <span>{vehicle?.plate || "No Vehicle"}</span>
        </div>
      </header>

      {/* Action Buttons */}
      <div className="action-area">
        {!activeTicket ? (
          <button className="btn-park-now" onClick={handlePark}>
             <span>P</span> Auto Allocate Space
          </button>
        ) : (
          <div className="active-ticket-card">
            <div className="ticket-header">
              <span>PARKING ACTIVE</span>
              <span className="live-tag">● LIVE</span>
            </div>
            <div className="ticket-details">
              <h1>Floor {activeTicket.floor + 1}</h1>
              <p>Row {activeTicket.row + 1} / Spot {activeTicket.col + 1}</p>
            </div>
            <button className="btn-exit" onClick={handleExit}>Exit & Pay</button>
          </div>
        )}
      </div>

      {/* Parking Map */}
      <div className="parking-structure">
        {parkingData.map((floor, fIndex) => (
          <div key={fIndex} className="floor-wrapper">
            <div className="floor-label">0{fIndex + 1} Floor</div>
            
            <div className="floor-layout">
              {/* Entry Gate */}
              <div className="gate"><span>ENTRY <ArrowDown size={12}/></span></div>

              <div className="parking-grid">
                {floor.map((row, rIndex) => (
                  <div key={rIndex} className="parking-row">
                    {/* Left Bank (Cols 0-2) */}
                    <div className="bank left">
                      {row.slice(0, 3).map((spot, cIndex) => renderSpot(spot, fIndex, rIndex, cIndex))}
                    </div>
                    
                    {/* Road */}
                    <div className="road-lane"><div className="road-dash"></div></div>

                    {/* Right Bank (Cols 3-5) */}
                    <div className="bank right">
                      {row.slice(3, 6).map((spot, cIndex) => renderSpot(spot, fIndex, rIndex, cIndex + 3))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Exit Gate */}
              <div className="gate"><span>EXIT <ArrowDown size={12}/></span></div>
            </div>
            
            <div className="floor-decor left-decor">ELEV</div>
            <div className="floor-decor right-decor">STAIR</div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Payment</h2>
            <div style={{margin: '20px 0', fontSize: '2rem', fontWeight: 'bold'}}>₹{cost}.00</div>
            <div className="fake-cards">
              <div className="card-option selected">💳 Visa **** 4242</div>
              <h1></h1>
            </div>
            <button className="btn-primary" onClick={processPayment}>Confirm Payment</button>
          </div>
        </div>
      )}
    </div>
  );
}