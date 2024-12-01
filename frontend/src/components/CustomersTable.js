import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('/api/customers').then((response) => setCustomers(response.data));
  }, []);

  return (
    <div>
      <h2>Customers</h2>
      <table>
        <thead>
          <tr>
            <th>CustomerID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.CustomerID}>
              <td>{customer.CustomerID}</td>
              <td>{customer.Name}</td>
              <td>{customer.Email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
