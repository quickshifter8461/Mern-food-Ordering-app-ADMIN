import React, { createContext, useContext, useState } from "react";


const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appState, setAppState] = useState({});
  

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
