import React, { createContext, useContext, useState } from "react";

// Tạo context
const AppContext = createContext();

// Provider component để bao bọc ứng dụng
export const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // Trạng thái người dùng
  const [toastMessage, setToastMessage] = useState(null); // Trạng thái thông báo

  // Hàm hiển thị thông báo
  const showToast = ({ message, type }) => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000); // Ẩn thông báo sau 3 giây
  };

  // Trả về context với giá trị bao gồm cả trạng thái và các hàm thao tác
  return (
    <AppContext.Provider value={{ userData, setUserData, showToast }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useAppContext = () => useContext(AppContext);
