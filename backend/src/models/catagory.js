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
  const createCategoryTable = `
    CREATE TABLE IF NOT EXISTS categories (
      category_id INT AUTO_INCREMENT PRIMARY KEY,
      category_name VARCHAR(255) NOT NULL,
      description TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      store_id INT NOT NULL,  -- Thêm trường store_id
      FOREIGN KEY (store_id) REFERENCES stores(store_id) -- Liên kết với bảng stores
    );
  `;
  try {
    await connection.execute(createCategoryTable);
    console.log('Bảng "categories" đã được tạo hoặc đã tồn tại.');
  } catch (err) {
    console.error('Lỗi khi tạo bảng "categories":', err);
  }
})();

// Tạo một model Category
const Category = {
  // Lấy tất cả danh mục
  getAll: async () => {
    const query = 'SELECT * FROM categories';
    const [results] = await connection.execute(query);
    return results;
  },

  // Lấy một danh mục theo trường và giá trị
  findOne: async (field, value) => {
    if (!field || value === undefined) {
      throw new Error('Field and value are required for findOne');
    }
    const query = `SELECT * FROM categories WHERE ${field} = ? LIMIT 1`;
    const [results] = await connection.execute(query, [value]);
    return results[0]; // Trả về bản ghi duy nhất
  },

  // Lấy danh mục theo ID
  getById: async (id) => {
    const query = 'SELECT * FROM categories WHERE category_id = ?';
    const [results] = await connection.execute(query, [id]);
    return results[0]; // Trả về bản ghi duy nhất
  },

  // Lấy danh mục theo Store ID
  getByStoreId: async (store_id) => {
    const query = 'SELECT * FROM categories WHERE store_id = ?';
    const [results] = await connection.execute(query, [store_id]);
    return results; // Trả về danh sách các danh mục của cửa hàng
  },

  // Thêm danh mục mới
  create: async (categoryData) => {
    const query = `
      INSERT INTO categories (category_name, description, store_id)
      VALUES (?, ?,  ?)
    `;
    const { category_name, description, store_id } = categoryData;
    const [results] = await connection.execute(query, [
      category_name, description, store_id
    ]);
    return results.insertId; // Trả về ID của category mới
  },

  // Cập nhật thông tin danh mục
  update: async (id, categoryData) => {
    const query = `
      UPDATE categories
      SET category_name = ?, description = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE category_id = ?
    `;
    
    const { category_name, description } = categoryData;  
    const [results] = await connection.execute(query, [
      category_name, description, id
    ]);
    
    return results.affectedRows; // Trả về số dòng bị ảnh hưởng
  },

  // Xóa danh mục
  delete: async (id) => {
    const query = 'DELETE FROM categories WHERE category_id = ?';
    const [results] = await connection.execute(query, [id]);
    return results.affectedRows; // Trả về số dòng bị ảnh hưởng
  }
};

// Export model để sử dụng trong các file khác
module.exports = Category;
