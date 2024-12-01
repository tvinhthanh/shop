import React, { useState } from "react";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";

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

const EditRoom: React.FC = () => {
  const { userId } = useAppContext();
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();

  const [roomType, setRoomType] = useState("");
  const [price, setPrice] = useState("");
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [availabilityStatus, setAvailabilityStatus] = useState(1);

  const { data: room, isLoading, error } = useQuery(
    ["getRoomById", roomId],
    async () => {
      if (!roomId) throw new Error("Invalid hotel or room ID");
      return await apiClient.getRoomById(roomId);
    },
    {
      onSuccess: (data) => {
        setRoomType(data.room_type);
        setPrice(data.price.toString());
        setAdultCount(data.adult_count);
        setChildCount(data.child_count);
        setFacilities(JSON.parse(data.facilities || "[]"));
        setAvailabilityStatus(data.availability_status);
        setImages(data.images || []);
      },
      onError: () => {
        alert("Không thể tải thông tin phòng.");
        navigate(-1); 
      },
    }
  );

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
      alert("Thiếu thông tin User ID. Vui lòng đăng nhập.");
      return;
    }

    if (!roomType || !price || !adultCount || facilities.length === 0) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const formData = new FormData();
    formData.append("room_type", roomType);
    formData.append("price", price);
    formData.append("adult_count", adultCount.toString());
    formData.append("child_count", childCount.toString());
    formData.append("facilities", JSON.stringify(facilities));
    formData.append("availability_status", availabilityStatus.toString());

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await apiClient.updateRoom(roomId as string, formData);
      alert("Cập nhật phòng thành công!");
      navigate(`/room/${hotelId}`);
    } catch (error) {
      console.error("Lỗi khi cập nhật phòng:", error);
      alert("Cập nhật phòng thất bại.");
    }
  };

  if (isLoading) return <p>Đang tải thông tin phòng...</p>;
  if (error) return <p>Lỗi khi tải thông tin phòng!</p>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Chỉnh Sửa Phòng</h1>
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

        {/* Hiển thị hình ảnh hiện tại */}
<div className="flex flex-col">
  <label className="text-sm font-semibold">Hình Ảnh Hiện Tại:</label>
  <div className="flex gap-4">
    {images.length > 0 ? (
      images.map((image, index) => (
        <img
          key={index}
          src={URL.createObjectURL(image)}
          alt={`Room image ${index + 1}`}
          className="w-32 h-32 object-cover"
        />
      ))
    ) : (
      room?.image_urls?.length > 0 ? (
        room.image_urls.map((imageUrl: any, index: number) => (
          <img
            key={index}
            src={imageUrl} // URL từ dữ liệu cơ sở dữ liệu
            alt={`Room image ${index + 1}`}
            className="w-32 h-32 object-cover"
          />
        ))
      ) : (
        <p>Chưa có hình ảnh phòng</p>
      )
    )}
  </div>
</div>


        {/* Nút Available */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Trạng thái phòng:</label>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              availabilityStatus === 1
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setAvailabilityStatus(availabilityStatus === 1 ? 0 : 1)}
          >
            {availabilityStatus === 1 ? "Có sẵn" : "Không có sẵn"}
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Cập Nhật Phòng
        </button>
      </form>
    </div>
  );
};

export default EditRoom;
