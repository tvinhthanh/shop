const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');  // Import fs để kiểm tra và tạo thư mục 'uploads' nếu cần thiết

// Import các module đã khai báo từ upload.js
const { upload, uploadToCloudinary } = require('./middleware/upload');  // Đảm bảo đường dẫn đúng đến middleware

const app = express();

// Kiểm tra và tạo thư mục 'uploads' nếu không tồn tại (tùy chọn)
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Cấu hình CORS để cho phép yêu cầu từ frontend
app.use(cors({
    origin: 'http://localhost:5175',  // URL của frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,  // Cho phép cookie và thông tin xác thực
}));

// Middleware để phân tích JSON và cookie
app.use(express.json());
app.use(cookieParser());

// Tạo một kết nối MySQL (sử dụng connection pool)
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,  // Điều chỉnh số lượng kết nối dựa trên tải của bạn
});

// Kiểm tra kết nối cơ sở dữ liệu
app.get('/test-db', (req, res) => {
    connection.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu', error: err });
        }
        res.status(200).json({ message: 'Kết nối cơ sở dữ liệu thành công', solution: results[0].solution });
    });
});

// Định nghĩa các route API khác
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/catagory');
const storeRoutes = require('./routes/myStore');
const productRoutes = require('./routes/product');
const hotelRoutes = require('./routes/hotel');
const MyHotelRoutes = require('./routes/myhotel');
const bookingRoutes = require('./routes/booking');

// API Routes
app.use('/api/category', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/products', productRoutes);  // Đảm bảo sử dụng route đúng cho sản phẩm
app.use('/api/hotel', hotelRoutes);
app.use('/api/my-hotels', MyHotelRoutes);
app.use('/api/bookings', bookingRoutes);


// API để upload ảnh
app.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Không có tệp được tải lên' });
    }

    uploadToCloudinary(req.file)
      .then((result) => {
        res.status(200).json({
          message: 'Ảnh đã được tải lên thành công',
          url: result.secure_url,  // Trả về URL ảnh đã được tải lên Cloudinary
        });
      })
      .catch((error) => {
        console.error('Lỗi khi tải ảnh lên Cloudinary:', error);
        res.status(500).json({ message: 'Lỗi khi tải ảnh lên Cloudinary', error });
      });
});

// Cung cấp dịch vụ ảnh tải lên (tùy chọn nếu bạn muốn phục vụ ảnh trước khi upload)
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);  // Log lỗi
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
});

// Khởi động server trên cổng 5000
app.listen(5000, () => {
    console.log("Backend server đang chạy trên cổng 5000");
});
