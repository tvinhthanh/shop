const mysql = require('mysql2/promise'); // Sử dụng mysql2 với Promise
require('dotenv').config(); // Sử dụng biến môi trường cho cấu hình DB

// Tạo kết nối MySQL
const connection = mysql.createPool({
  host: process.env.DB_HOST,       // Ví dụ: 'localhost'
  user: process.env.DB_USER,       // Ví dụ: 'root'
  password: process.env.DB_PASSWORD, // Ví dụ: ''
  database: process.env.DB_NAME,    // Ví dụ: 'dacn'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Tạo bảng nếu chưa tồn tại
(async () => {
  const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
      id_user INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(15),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') DEFAULT 'user',
      address TEXT,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await connection.execute(createUserTable);
    console.log('Bảng "users" đã được tạo hoặc đã tồn tại.');
  } catch (err) {
    console.error('Lỗi khi tạo bảng "users":', err);
  }
})();

// Tạo một model User
const User = {
  // Lấy tất cả người dùng
  getAll: async () => {
    const query = 'SELECT * FROM users';
    const [results] = await connection.execute(query);
    return results;
  },

  // Lấy một người dùng theo trường và giá trị
  findOne: async (field, value) => {
    if (!field || value === undefined) {
      throw new Error('Field and value are required for findOne');
    }
    const query = `SELECT * FROM users WHERE ${field} = ? LIMIT 1`;
    const [results] = await connection.execute(query, [value]);
    return results[0];
  },

  // Lấy người dùng theo ID
  getById: async (id) => {
    const query = 'SELECT * FROM users WHERE id_user = ?';
    const [results] = await connection.execute(query, [id]);
    return results[0]; // Trả về bản ghi duy nhất
  },

  // Thêm người dùng mới
  create: async (userData) => {
    const query = `
      INSERT INTO users (first_name, last_name, phone, email, password, role, address, create_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const { first_name, last_name, phone, email, password, role, address, create_at } = userData;
    const [results] = await connection.execute(query, [
      first_name, last_name, phone, email, password, role, address, create_at
    ]);
    return results.insertId; // Trả về ID của user mới
  },

  // Cập nhật thông tin người dùng
  update: async (id, userData) => {
    const query = `
      UPDATE users
      SET first_name = ?, last_name = ?, phone = ?, email = ?, password = ?, role = ?, address = ?, create_at = ?
      WHERE id_user = ?
    `;
    const { first_name, last_name, phone, email, password, role, address, create_at } = userData;
    const [results] = await connection.execute(query, [
      first_name, last_name, phone, email, password, role, address, create_at, id
    ]);
    return results.affectedRows; // Trả về số dòng bị ảnh hưởng
  },

  // Xóa người dùng
  delete: async (id) => {
    const query = 'DELETE FROM users WHERE id_user = ?';
    const [results] = await connection.execute(query, [id]);
    return results.affectedRows; // Trả về số dòng bị ảnh hưởng
  }
};

// Export model để sử dụng trong các file khác
module.exports = User;
