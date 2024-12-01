import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
function App() {
  const products = [];
  return (
    <Router>
      <Navbar />
      <Banner />
      <ProductList title="Sản phẩm nổi bật" products={products} />
      <Footer />
    </Router>
  );
}

export default App;
