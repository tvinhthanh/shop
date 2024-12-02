import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage = () => {
  const { id } = useParams();  // Extract the product ID from the URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Error fetching product: ' + err.message);
      }
    };

    fetchProduct();
  }, [id]); // Re-fetch the product when the id changes

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold mb-5">{product.ProductName}</h1>
      <img src={product.ImageURL} alt={product.ProductName} className="w-80 h-80 object-cover mb-4" />
      <p className="text-red-500 font-bold">{product.Price}đ</p>
      <p className="text-gray-500">{product.Description}</p>
    </div>
  );
};

export default ProductDetailPage;
