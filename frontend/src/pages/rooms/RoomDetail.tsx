import { useQuery } from "react-query";
import { useParams, Link } from "react-router-dom";
import * as apiClient from "../../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiMoney, BiBed, BiStar } from "react-icons/bi";
import Slider from "react-slick";
import { useState } from "react";

const RoomDetail = () => {
  const { hotelId, roomId } = useParams(); // Lấy roomId từ URL

  // Lấy dữ liệu phòng theo roomId
  const { data: roomData, isLoading, isError } = useQuery(
    ['fetchRoom',hotelId, roomId],
    () => apiClient.fetchRoom(hotelId as string,roomId as string), // Gọi apiClient.fetchRoomById với roomId
    {
      onError: (error) => {
        console.error('Error fetching room details:', error);
      }
    }
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError || !roomData) {
    return <span>Không tìm thấy phòng này.</span>;
  }

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    checkInDate: '',
    checkOutDate: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý form đặt lịch ở đây
    console.log("Booking details:", formData);
    // Thực hiện gọi API hoặc chuyển hướng đến trang đặt phòng
  };

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const images = Array.isArray(roomData.image_urls) ? roomData.image_urls : [];

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{roomData.room_type}</h1>
      </div>
      <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
        {/* Kiểm tra xem image_urls có phải là mảng hợp lệ hay không */}
        {images.length > 0 ? (
          <Slider {...sliderSettings}>
            {images.map((image: string, index: number) => (
              <div key={index}>
                <img
                  src={image}
                  alt={roomData.room_type}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <div>
            <img
              src="/default-image.jpg" // Default image
              alt={roomData.room_type}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <BsBuilding className="text-blue-500" />
          <span>Hotel ID: {roomData.hotel_id}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <BiMoney className="text-blue-500" />
          <span>Giá: {roomData.price} VNĐ per night</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <BiBed className="text-blue-500" />
          <span>{roomData.adult_count} người lớn, {roomData.child_count} trẻ em</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <BiStar className="text-blue-500" />
          <span>Trạng thái: {roomData.availability_status === 1 ? "Available" : "Unavailable"}</span>
        </div>
      </div>

      {/* Form Đặt Lịch */}
      <div className="space-y-5">
        <h2 className="text-2xl font-semibold">Đặt phòng</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">
              Ngày nhận phòng
            </label>
            <input
              type="date"
              id="checkInDate"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">
              Ngày trả phòng
            </label>
            <input
              type="date"
              id="checkOutDate"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white text-xl font-bold py-2 px-6 rounded-lg hover:bg-blue-500"
            >
              Đặt phòng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomDetail;
