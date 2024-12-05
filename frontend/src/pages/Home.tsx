import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../api-client';

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  description: string;
  image: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    getProducts();
  }, []);

  // Function to handle adding/removing products from the favorites
  const toggleFavorite = (product: Product) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.product_id === product.product_id)) {
        return prevFavorites.filter((fav) => fav.product_id !== product.product_id); // Remove from favorites
      } else {
        return [...prevFavorites, product]; // Add to favorites
      }
    });
  };

  // Function to handle adding/removing products from the cart
  const toggleCart = (product: Product) => {
    setCart((prevCart) => {
      if (prevCart.some((item) => item.product_id === product.product_id)) {
        return prevCart.filter((item) => item.product_id !== product.product_id); // Remove from cart
      } else {
        return [...prevCart, product]; // Add to cart
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
            key={product.product_id}
            className="border rounded-lg p-4 shadow-lg flex flex-col items-center"
          >
            <img
              src={product.image}
              alt={product.product_name}
              className="w-40 h-40 object-cover mb-4"
            />
            <h2 className="text-xl font-semibold">{product.product_name}</h2>
            <p className="text-red-500 font-bold">{product.price}đ</p>
            <p className="text-gray-500">{product.description}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleFavorite(product)}
                className="mt-4 py-2 px-4 bg-transparent text-red-500 rounded"
              >
                {/* Hiển thị trái tim đầy nếu sản phẩm trong danh sách yêu thích */}
                <span className="text-2xl">
                  {favorites.some((fav) => fav.product_id === product.product_id) ? '❤️' : '🤍'}
                </span>
              </button>
              <button
                onClick={() => toggleCart(product)}
                className="mt-4 py-2 px-4 bg-green-500 text-white rounded"
              >
                {cart.some((item) => item.product_id === product.product_id)
                  ? 'Bỏ vào giỏ hàng'
                  : 'Thêm vào giỏ hàng'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <h1 className="text-3xl font-bold mt-10 mb-5">Danh sách yêu thích</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {favorites.map((product) => (
          <div
            key={product.product_id}
            className="border rounded-lg p-4 shadow-lg flex flex-col items-center"
          >
            <img
              src={product.image}
              alt={product.product_name}
              className="w-40 h-40 object-cover mb-4"
            />
            <h2 className="text-xl font-semibold">{product.product_name}</h2>
            <p className="text-red-500 font-bold">{product.price}đ</p>
            <p className="text-gray-500">{product.description}</p>
          </div>
        ))}
      </div>

      <h1 className="text-3xl font-bold mt-10 mb-5">Danh sách giỏ hàng</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cart.map((product) => (
          <div
            key={product.product_id}
            className="border rounded-lg p-4 shadow-lg flex flex-col items-center"
          >
            <img
              src={product.image}
              alt={product.product_name}
              className="w-40 h-40 object-cover mb-4"
            />
            <h2 className="text-xl font-semibold">{product.product_name}</h2>
            <p className="text-red-500 font-bold">{product.price}đ</p>
            <p className="text-gray-500">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
