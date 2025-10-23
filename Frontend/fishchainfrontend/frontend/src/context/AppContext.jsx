// AppContext.js
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [batches, setBatches] = useState([]);

  const addBatch = (batch) => {
    setBatches([...batches, batch]);
    // Also save the batch to localStorage
    localStorage.setItem('batches', JSON.stringify([...batches, batch]));
  };

  return (
    <AppContext.Provider value={{ batches, addBatch }}>
      {children}
    </AppContext.Provider>
  );
};