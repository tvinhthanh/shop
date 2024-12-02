import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import './index.css';
import { AppProvider } from "./contexts/AppContext"; // Import AppProvider
import { QueryClient, QueryClientProvider } from "react-query"; // Import QueryClient and QueryClientProvider

// Example of HomePage and ProductDetailPage
import HomePage from './layout/HomePage';
import ProductDetailPage from './components/ProductDetailPage';
import Login from './layout/Login';
import Register from './layout/Register';

// Create QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <AppProvider>
      {/* Wrap the entire application with QueryClientProvider */}
      <QueryClientProvider client={queryClient}>
        <Router>
          <Navbar />
          <Routes>
            {/* Define your routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Add other routes here */}
          </Routes>
          <Footer />
        </Router>
      </QueryClientProvider>
    </AppProvider>
  );
}

export default App;
