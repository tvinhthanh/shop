import React, { useState } from 'react';
import * as apiClient from '../../api-client'; // Import API client
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const AddStore: React.FC = () => {
  const { userId } = useAppContext(); // Lấy userId từ context
  const [storeName, setStoreName] = useState(''); // Tên cửa hàng
  const [address, setAddress] = useState(''); // Địa chỉ
  const [image, setImage] = useState<File | null>(null); // File ảnh

  const navigate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Kiểm tra userId
    if (!userId) {
      alert('Bạn cần đăng nhập để thực hiện chức năng này.');
      return;
    }

    // Kiểm tra các trường bắt buộc
    if (!storeName || !address) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    // Chuẩn bị FormData
    const formData = new FormData();
    formData.append('user_id', userId as string); // ID người dùng
    formData.append('store_name', storeName); // Tên cửa hàng
    formData.append('address', address); // Địa chỉ
    if (image) {
      formData.append('image', image); // Ảnh
    }

    try {
      await apiClient.addMyStore(formData); // Gửi dữ liệu lên API
      alert('Thêm cửa hàng thành công!');
      navigate('/my-stores'); // Điều hướng về danh sách cửa hàng
    } catch (error) {
      console.error('Lỗi khi thêm cửa hàng:', error);
      alert('Không thể thêm cửa hàng, vui lòng thử lại.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Thêm Cửa Hàng</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="storeName" className="text-sm font-semibold">
            Tên cửa hàng:
          </label>
          <input
            id="storeName"
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="address" className="text-sm font-semibold">
            Địa chỉ:
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="image" className="text-sm font-semibold">
            Hình ảnh:
          </label>
          <input
            id="image"
            type="file"
            onChange={handleImageChange}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Thêm cửa hàng
        </button>
      </form>
    </div>
  );
};

export default AddStore;
