import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartTable = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get('/api/cart').then((response) => setCart(response.data));
  }, []);

  return (
    <div>
      <h2>Cart</h2>
      <table>
        <thead>
          <tr>
            <th>CartID</th>
            <th>CustomerID</th>
            <th>ProductID</th>
            <th>Quantity</th>
            <th>DateAdded</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.CartID}>
              <td>{item.CartID}</td>
              <td>{item.CustomerID}</td>
              <td>{item.ProductID}</td>
              <td>{item.Quantity}</td>
              <td>{item.DateAdded}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
