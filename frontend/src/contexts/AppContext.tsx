import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { loadStripe, Stripe } from "@stripe/stripe-js";

// Stripe public key for loading Stripe
const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

// Type definition for Toast message
type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

// AppContext type definition
type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  stripePromise: Promise<Stripe | null>;
  userId: string | null;
  userRole: string | null;
  storeId: string | null;  // Added storeId to context
  setUserData: (id: string, userRole: string) => void; // Function to set user data in context
  setStoreId: (storeId: string) => void; // Function to set storeId in context
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

// Initialize Stripe promise if the key exists
const stripePromise = STRIPE_PUB_KEY ? loadStripe(STRIPE_PUB_KEY) : Promise.resolve(null);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null); // Added setter function for storeId

  // Query to validate the token and get user information
  const { isError, isLoading, data } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
    onSuccess: (data) => {
      if (data?.userId && data?.userRole) {
        setUserId(data.userId); // Set userId after successful token validation
        setUserRole(data.userRole); // Set userRole after successful token validation
      }
    },
  });

  // Query to fetch store based on userId
  const { data: storeData } = useQuery(
    "fetchStore",
    () => apiClient.fetchMyStores(userId ?? ""),
    {
      enabled: !!userId, // Only run if userId is available
      onSuccess: (data) => {
        if (data && data.length > 0) {
          setStoreId(data[0].store_id); // Set the first store's ID
        }
      },
    }
  );

  // Determine if the user is logged in based on the error/loading state
  const isLoggedIn = !isError && !isLoading;

  // Function to update user data in context
  const setUserData = (id: string, userRole: string) => {
    setUserId(id);
    setUserRole(userRole);
  };

  console.log(userId);
    console.log(storeId);

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage); // Display toast messages
        },
        isLoggedIn, // User login status
        stripePromise, // Stripe promise for payment integration
        userId, // User ID from the context
        userRole, // User userRole from the context
        storeId, // Current storeId
        setStoreId, // Function to set storeId
        setUserData, // Set user data function for updating the context
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)} // Close toast on close action
        />
      )}
      {children} {/* Render child components */}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
