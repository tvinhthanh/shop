import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import * as apiClient from "../../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiMoney, BiBed, BiStar } from "react-icons/bi";
import Slider from "react-slick";

const MyRooms = () => {
  const { hotelId } = useParams();
  if (!hotelId) {
    return <span>Hotel ID is missing or invalid.</span>;
  }

  const { data: roomData, isLoading, isError } = useQuery(
    ['fetchMyRooms', hotelId],
    () => apiClient.fetchMyRooms(hotelId),
    {
      onError: (error) => {
        console.error('Error fetching rooms:', error);
      }
    }
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError || !roomData || roomData.length === 0) {
    return (
      <div className="flex justify-between items-center bg-gray-100 p-6 rounded-lg shadow-lg">
        <div>
          <p className="text-xl font-semibold text-gray-700">Không có phòng nào cho khách sạn này.</p>
          <p className="text-sm text-gray-500">Vui lòng thêm phòng mới để quản lý.</p>
        </div>
        <Link
          to={`/hotel/${hotelId}/add-room`} // Corrected the `to` prop
          className="bg-blue-600 text-white text-lg font-bold py-2 px-4 rounded-lg hover:bg-blue-500"
        >
          Thêm phòng
        </Link>
      </div>
    );
  }

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Adjust to change speed of the slideshow
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Các phòng trong khách sạn</h1>
        <Link
          to={`/hotel/${hotelId}/add-room`} // Corrected the `to` prop
          className="bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
        >
          Thêm phòng
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-8">
        {roomData.map((room: any) => {
          // Kiểm tra và xử lý image_urls
          let images = room.image_urls;
          if (typeof images === 'string') {
            try {
              // Nếu image_urls là chuỗi JSON, parse nó thành mảng
              images = JSON.parse(images);
            } catch (error) {
              console.error("Error parsing image_urls:", error);
              images = []; // Nếu không parse được, gán là mảng rỗng
            }
          }

          return (
            <div
              key={room.room_id}
              className="flex flex-col border border-slate-300 rounded-lg p-6 gap-6"
            >
              <h2 className="text-2xl font-semibold">{room.room_type}</h2>
              <div className="text-sm text-gray-600">
                {JSON.parse(room.facilities).join(", ")}
              </div>
              <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                {/* Kiểm tra xem image_urls có phải là mảng hợp lệ hay không */}
                {Array.isArray(images) && images.length > 0 ? (
                  <Slider {...sliderSettings}>
                    {images.map((image: string, index: number) => (
                      <div key={index}>
                        <img
                          src={image}
                          alt={room.room_type}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div>
                    <img
                      src="/default-image.jpg" // Default image
                      alt={room.room_type}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <BsBuilding className="text-blue-500" />
                  <span>Hotel ID: {room.hotel_id}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <BiMoney className="text-blue-500" />
                  <span>Giá: {room.price}VNĐ per night</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <BiBed className="text-blue-500" />
                  <span>{room.adult_count} người lớn, {room.child_count} trẻ em</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <BiStar className="text-blue-500" />
                  <span>Trạng thái: {room.availability_status === 1 ? "Available" : "Unavailable"}</span>
                </div>
              </div>
              <Link
                to={`/edit-room/${room.room_id}`}
                className="bg-blue-600 text-white text-lg font-bold py-1 px-4 rounded-lg hover:bg-blue-500 inline-block"
              >
                Chỉnh sửa phòng
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRooms;
