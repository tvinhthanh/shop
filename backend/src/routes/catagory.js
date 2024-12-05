const express = require('express');
const Category = require('../models/catagory'); // Import Category model
const router = express.Router();

// Route to get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);  // Trả về tất cả danh mục
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
});

// Route to get a single category by ID
router.get('/:id', async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.getById(categoryId);
    if (category) {
      res.json(category);  // Trả về danh mục tìm thấy
    } else {
      res.status(404).json({ message: 'Category not found' });  // Không tìm thấy danh mục
    }
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ message: 'Error fetching category', error: err.message });
  }
});

// Route to create a new category
router.put("/:id", async (req, res) => {
  const { id } = req.params; // Lấy category_id từ params
  const { category_name, description } = req.body; // Lấy thông tin cập nhật từ body

  // Kiểm tra thông tin đầu vào
  if (!category_name || !description) {
    return res.status(400).json({
      message: "Vui lòng cung cấp đầy đủ thông tin: category_name và description.",
    });
  }

  try {
    const updatedRows = await Category.update(id, { category_name, description });

    if (updatedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục với ID đã cho.",
      });
    }

    res.status(200).json({
      message: "Cập nhật danh mục thành công!",
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật danh mục:", err);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi cập nhật danh mục.",
      error: err.message,
    });
  }
});
  

// Route to update an existing category
router.put('/:id', async (req, res) => {
  const categoryId = req.params.id;
  const categoryData = req.body;

  if (!categoryData.category_name || !categoryData.description || !categoryData.store_id) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin: category_name, description và store_id.' });
  }

  try {
    const affectedRows = await Category.update(categoryId, categoryData);
    if (affectedRows > 0) {
      res.json({ message: 'Danh mục đã được cập nhật' });
    } else {
      res.status(404).json({ message: 'Danh mục không tìm thấy' });
    }
  } catch (err) {
    console.error('Lỗi khi cập nhật danh mục:', err);
    res.status(500).json({ message: 'Lỗi khi cập nhật danh mục', error: err.message });
  }
});

// Route to delete a category
router.delete('/:id', async (req, res) => {
  const categoryId = req.params.id;
  try {
    const affectedRows = await Category.delete(categoryId);
    if (affectedRows > 0) {
      res.json({ message: 'Danh mục đã được xóa' });
    } else {
      res.status(404).json({ message: 'Danh mục không tìm thấy' });
    }
  } catch (err) {
    console.error('Lỗi khi xóa danh mục:', err);
    res.status(500).json({ message: 'Lỗi khi xóa danh mục', error: err.message });
  }
});
router.get('/store/:storeId', async (req, res) => {
    const { storeId } = req.params;  // Lấy storeId từ URL params
  
    try {
      // Fetch categories for the specific store from the database
      const categories = await Category.getByStoreId(storeId);  // Assuming the method getByStoreId exists in the Category model
  
      if (categories && categories.length > 0) {
        res.json(categories);  // Return the categories associated with the store
      } else {
        res.status(404).json({ message: 'Không tìm thấy danh mục cho cửa hàng này' });  // If no categories found
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh mục:', err);
      res.status(500).json({ message: 'Lỗi khi lấy danh mục', error: err.message });
    }
  });
  
module.exports = router;
