import React, { createContext, useState, useContext, useEffect } from 'react';

const ParkingContext = createContext();

export const useParking = () => useContext(ParkingContext);

// Helper: Generate 3 Floors of 6x6 grids
const generateFloors = () => {
  const floors = [];
  for (let f = 0; f < 3; f++) {
    const floor = [];
    for (let r = 0; r < 6; r++) {
      const row = [];
      for (let c = 0; c < 6; c++) {
        row.push({ 
          id: `f${f}-r${r}-c${c}`, 
          occupied: Math.random() < 0.3, // 30% random occupancy
          vehicle: null 
        });
      }
      floor.push(row);
    }
    floors.push(floor);
  }
  return floors;
};

export const ParkingProvider = ({ children }) => {
  // 1. Load from LocalStorage or Default
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('parking_user')) || null);
  const [vehicle, setVehicle] = useState(() => JSON.parse(localStorage.getItem('parking_vehicle')) || null);
  
  // Parking grid doesn't need persistence for this demo (resets on refresh for variety)
  const [parkingData, setParkingData] = useState(generateFloors());
  const [activeTicket, setActiveTicket] = useState(null);

  // 2. Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('parking_user', JSON.stringify(user));
    localStorage.setItem('parking_vehicle', JSON.stringify(vehicle));
  }, [user, vehicle]);

  const login = (credentials) => {
    setUser({ 
      name: "Alex Driver", 
      phone: "987-654-3210", 
      email: credentials.email || "alex@drive.com" 
    });
  };

  const logout = () => {
    setUser(null);
    setVehicle(null);
    setActiveTicket(null);
    localStorage.clear();
  };

  const updateProfile = (uData, vData) => {
    setUser({ ...user, ...uData });
    setVehicle(vData);
  };

  // Algorithm: Find first free spot starting from Floor 0
  const autoAllocateSpot = () => {
    if (activeTicket) return null;

    const newFloors = [...parkingData];
    let allocated = null;

    for (let f = 0; f < 3; f++) {
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          if (!newFloors[f][r][c].occupied) {
            newFloors[f][r][c].occupied = true;
            newFloors[f][r][c].vehicle = vehicle?.plate || "MY-CAR";
            allocated = { floor: f, row: r, col: c, startTime: Date.now() };
            
            setParkingData(newFloors);
            setActiveTicket(allocated);
            return allocated; // Return immediately after finding one
          }
        }
      }
    }
    return null; // Full
  };

  const exitParking = () => {
    if (!activeTicket) return;
    const { floor, row, col } = activeTicket;
    
    const newFloors = [...parkingData];
    newFloors[floor][row][col].occupied = false;
    newFloors[floor][row][col].vehicle = null;
    
    setParkingData(newFloors);
    setActiveTicket(null);
  };

  return (
    <ParkingContext.Provider value={{ 
      user, vehicle, parkingData, login, logout, updateProfile, 
      autoAllocateSpot, activeTicket, exitParking 
    }}>
      {children}
    </ParkingContext.Provider>
  );
};