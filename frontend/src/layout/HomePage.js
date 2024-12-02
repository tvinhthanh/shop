import React from 'react';
import Banner from '../components/Banner';
import ProductList from '../components/ProductList';

const HomePage = () => {
  const products = []; // Load or fetch products here
  return (
    <div>
      <Banner />
      <ProductList title="Sản phẩm nổi bật" products={products} />
    </div>
  );
};

export default HomePage;
