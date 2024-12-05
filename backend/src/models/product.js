const connection = require("../config/database"); // Kết nối cơ sở dữ liệu

const Product = {
  // Tạo bảng sản phẩm nếu chưa có
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS products (
        product_id INT AUTO_INCREMENT PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        category_id INT NOT NULL,
        store_id INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        description TEXT DEFAULT NULL,
        image VARCHAR(255) NOT NULL,  -- Lưu URL hình ảnh
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    try {
      await connection.execute(query);
      console.log('Bảng products đã được tạo hoặc đã tồn tại.');
    } catch (error) {
      console.error("Lỗi khi tạo bảng:", error);
      throw new Error("Không thể tạo bảng products.");
    }
  },

  create: async (productData) => {
    const query = `
      INSERT INTO products (
        product_name, category_id, store_id, price, stock, description, image, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
  
    const {
      product_name,
      category_id,
      store_id,
      price,
      stock,
      description,
      image,  // image có thể là mảng hoặc chuỗi URL
    } = productData;
  
    try {
      // Kiểm tra và đảm bảo `image` là một mảng hợp lệ
      if (Array.isArray(image)) {
        image = JSON.stringify(image);  // Chuyển mảng hình ảnh thành chuỗi JSON
      }
  
      // Thực thi truy vấn
      const [results] = await connection.execute(query, [
        product_name,
        category_id,
        store_id,
        price,
        stock,
        description || null,
        image, // Lưu ảnh dưới dạng chuỗi JSON hợp lệ
      ]);
  
      // Trả về ID của sản phẩm vừa được thêm
      return results.insertId;  
    } catch (error) {
      console.error("Error inserting product:", error);
      throw new Error("Không thể tạo sản phẩm.");
    }
  },
  
  

  // Lấy tất cả sản phẩm
  findAll: async () => {
    const query = "SELECT * FROM products";
    try {
      const [results] = await connection.execute(query);
      return results;
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      throw new Error("Không thể lấy danh sách sản phẩm.");
    }
  },

  // Lấy sản phẩm theo ID
  findById: async (id) => {
    const query = "SELECT * FROM products WHERE product_id = ?";
    try {
      const [results] = await connection.execute(query, [id]);
      return results[0];
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      throw new Error("Không thể lấy sản phẩm.");
    }
  },

  // Lấy sản phẩm theo store_id
  findByStoreId: async (storeId) => {
    const query = "SELECT * FROM products WHERE store_id = ?";
    try {
      const [results] = await connection.execute(query, [storeId]);
      return results;
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm theo store_id:", error);
      throw new Error("Không thể lấy sản phẩm cho store_id này.");
    }
  },

  // Cập nhật sản phẩm
  update: async (id, productData) => {
    const query = `
      UPDATE products
      SET product_name = ?, category_id = ?, store_id = ?, price = ?, stock = ?, description = ?, image = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE product_id = ?
    `;
    const {
      product_name,
      category_id,
      store_id,
      price,
      stock,
      description,
      image,
    } = productData;

    try {
      const [results] = await connection.execute(query, [
        product_name,
        category_id,
        store_id,
        price,
        stock,
        description || null,
        image,
        id,
      ]);

      return results.affectedRows; // Trả về số dòng bị ảnh hưởng
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      throw new Error("Không thể cập nhật sản phẩm.");
    }
  },

  // Xóa sản phẩm theo ID
  delete: async (id) => {
    const query = "DELETE FROM products WHERE product_id = ?";
    try {
      const [results] = await connection.execute(query, [id]);
      return results.affectedRows; // Trả về số dòng bị xóa
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      throw new Error("Không thể xóa sản phẩm.");
    }
  },
};

module.exports = Product;
