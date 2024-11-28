import React, { useState } from 'react';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate, useParams } from 'react-router-dom';

export const roomTypes = [
  "Phòng Deluxe Suite",
  "Phòng Tiêu Chuẩn",
  "Phòng Cao Cấp",
  "Phòng Gia Đình",
  "Phòng Đơn",
  "Phòng Đôi",
  "Phòng Studio",
];

export const availableFacilities = [
    "WiFi miễn phí",
    "Điều hòa không khí",
    "Minibar",
    "Ban công riêng",
    "Phòng khách riêng biệt",
    "Bồn tắm",
    "Đồ vệ sinh cao cấp (luxury amenities)",
    "Khu vực ngắm cảnh riêng",
    "Phòng rộng rãi phù hợp gia đình",
    "Trò chơi trẻ em",
    "Dịch vụ phòng 24/7",
    "Bàn làm việc chuyên dụng",
    "Bồn tắm nước nóng (jacuzzi)",
    "Dịch vụ trang trí phòng (hoa, nến)",
    "Bữa ăn sáng tại giường",
    "Hồ bơi riêng",
    "Tiện ích thể thao ngoài trời (ván lướt sóng, dụng cụ bơi)",
    "Tiện ích thể thao ngoài trời (dụng cụ trượt tuyết)",
    "Khu vực ngắm cảnh tuyết",
    "Đồ ăn và thức uống không giới hạn",
    "Spa miễn phí",
  ];
  
const AddRoom: React.FC = () => {
  const { userId } = useAppContext();
  const { hotelId } = useParams();

  const [roomType, setRoomType] = useState('');
  const [price, setPrice] = useState('');
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [availabilityStatus, setAvailabilityStatus] = useState(0);  // Track availability status
  const navigate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setImages(filesArray);
    }
  };

  const toggleFacility = (facility: string) => {
    setFacilities((prevFacilities) =>
      prevFacilities.includes(facility)
        ? prevFacilities.filter((item) => item !== facility)
        : [...prevFacilities, facility]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!userId) {
      alert('Thiếu thông tin User ID. Vui lòng đăng nhập.');
      return;
    }
  
    if (!roomType || !price || !adultCount || facilities.length === 0) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }
  
    const formData = new FormData();
    formData.append('hotel_id', hotelId as string);
    formData.append('room_type', roomType);
    formData.append('price', price);
    formData.append('adult_count', adultCount.toString());
    formData.append('child_count', childCount.toString());
    formData.append('facilities', JSON.stringify(facilities));
    formData.append('availability_status', availabilityStatus.toString());
  
    // Chuyển danh sách hình ảnh thành mảng và gửi lên server
    images.forEach(image => {
        formData.append('images', image); // Thêm hình ảnh vào FormData
      });
    
    try {
      await apiClient.addRoom(formData);
      alert('Thêm phòng thành công!');
      navigate(`/room/:hotelId`);
    } catch (error) {
      console.error('Lỗi khi thêm phòng:', error);
      alert('Thêm phòng thất bại.');
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Thêm Phòng</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Loại Phòng */}
        <div className="flex flex-col">
          <label htmlFor="roomType" className="text-sm font-semibold">Loại Phòng:</label>
          <select
            id="roomType"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          >
            <option value="" disabled>Chọn loại phòng</option>
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Giá Phòng */}
        <div className="flex flex-col">
          <label htmlFor="price" className="text-sm font-semibold">Giá Phòng:</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Số Người Lớn */}
        <div className="flex flex-col">
          <label htmlFor="adultCount" className="text-sm font-semibold">Số Người Lớn:</label>
          <input
            id="adultCount"
            type="number"
            value={adultCount}
            onChange={(e) => setAdultCount(Number(e.target.value))}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Số Trẻ Em */}
        <div className="flex flex-col">
          <label htmlFor="childCount" className="text-sm font-semibold">Số Trẻ Em:</label>
          <input
            id="childCount"
            type="number"
            value={childCount}
            onChange={(e) => setChildCount(Number(e.target.value))}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Tiện Nghi */}
        <div className="flex flex-col">
  <label className="text-sm font-semibold">Tiện Nghi:</label>
  <div className="grid grid-cols-5 gap-3">
    {availableFacilities.map((facility) => (
      <div key={facility} className="flex items-center gap-2">
        <span className="text-sm font-semibold">{facility}</span>
        <label className="relative inline-block w-12 mr-2 align-middle select-none">
          <input
            type="checkbox"
            checked={facilities.includes(facility)}
            onChange={() => toggleFacility(facility)}
            className="opacity-0 absolute block w-6 h-6 rounded-full bg-transparent cursor-pointer"
          />
          <span
            className={`block w-12 h-6 rounded-full border-2 transition-all duration-200 ease-in-out ${
              facilities.includes(facility)
                ? "bg-blue-500 border-blue-500"
                : "bg-gray-300 border-gray-300"
            }`}
          >
            <span
              className={`block w-6 h-6 bg-white rounded-full transition-all duration-200 ease-in-out ${
                facilities.includes(facility) ? "translate-x-6" : ""
              }`}
            ></span>
          </span>
        </label>
      </div>
    ))}
  </div>
</div>





        {/* Hình Ảnh */}
        <div className="flex flex-col">
          <label htmlFor="images" className="text-sm font-semibold">Hình Ảnh:</label>
          <input
            id="images"
            type="file"
            onChange={handleImageChange}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            accept="image/*"
            multiple
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Thêm Phòng
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
