import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]); // State to hold favorite products
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products'); // Backend URL
        setProducts(response.data);
      } catch (err) {
        setError('Error fetching products: ' + err.message);
      }
    };

    fetchProducts();
  }, []);

  // Function to handle adding/removing products from the favorites
  const toggleFavorite = (product) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.ProductID === product.ProductID)) {
        return prevFavorites.filter((fav) => fav.ProductID !== product.ProductID); // Remove from favorites
      } else {
        return [...prevFavorites, product]; // Add to favorites
      }
    });
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold mb-5">Danh sách sản phẩm</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.ProductID}
            className="border rounded-lg p-4 shadow-lg flex flex-col items-center"
          >
            <img
              src={product.ImageURL}
              alt={product.ProductName}
              className="w-40 h-40 object-cover mb-4"
            />
            <h2 className="text-xl font-semibold">{product.ProductName}</h2>
            <p className="text-red-500 font-bold">{product.Price}đ</p>
            <p className="text-gray-500">{product.Description}</p>
            <button
              onClick={() => toggleFavorite(product)}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded"
            >
              {favorites.some((fav) => fav.ProductID === product.ProductID)
                ? 'Remove from Favorites'
                : 'Add to Favorites'}
            </button>
          </div>
        ))}
      </div>

      <h1 className="text-3xl font-bold mt-10 mb-5">Danh sách yêu thích</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {favorites.map((product) => (
          <div
            key={product.ProductID}
            className="border rounded-lg p-4 shadow-lg flex flex-col items-center"
          >
            <img
              src={product.ImageURL}
              alt={product.ProductName}
              className="w-40 h-40 object-cover mb-4"
            />
            <h2 className="text-xl font-semibold">{product.ProductName}</h2>
            <p className="text-red-500 font-bold">{product.Price}đ</p>
            <p className="text-gray-500">{product.Description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
