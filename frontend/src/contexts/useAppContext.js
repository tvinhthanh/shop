import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = ({ message, type }) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);  // Hide toast after 3 seconds
  };

  return (
    <AppContext.Provider value={{ userData, setUserData, showToast }}>
      {children}
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
