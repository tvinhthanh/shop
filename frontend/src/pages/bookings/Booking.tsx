import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import * as apiClient from "../../api-client";
import { BiMoney, BiCalendar, BiUser, BiCheckCircle } from "react-icons/bi";

const Bookings = () => {
  const { hotelId } = useParams(); // Lấy hotelId từ URL
  if (!hotelId) {
    return <span>Hotel ID is missing or invalid.</span>;
  }

  // Lấy danh sách bookings từ API dựa trên hotelId
  const { data: bookingData, isLoading, isError } = useQuery(
    ["fetchBookings", hotelId],
    () => apiClient.fetchBookings(hotelId), // Gọi API lấy danh sách bookings
    {
      onError: (error) => {
        console.error("Error fetching bookings:", error);
      },
    }
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError || !bookingData || bookingData.length === 0) {
    return <span>Không có đặt phòng nào cho khách sạn này.</span>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Danh sách đặt phòng</h1>
      <div className="grid grid-cols-1 gap-8">
        {bookingData.map((booking: any) => {
          return (
            <div
              key={booking.booking_id}
              className="flex flex-col border border-slate-300 rounded-lg p-6 gap-6"
            >
              <h2 className="text-2xl font-semibold">Đặt phòng #{booking.booking_id}</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <BiUser className="text-blue-500" />
                  <span>User ID: {booking.user_id}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <BiMoney className="text-blue-500" />
                  <span>Tổng giá: {booking.total_price} VNĐ</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <BiCalendar className="text-blue-500" />
                  <span>
                    Ngày nhận phòng: {booking.check_in_date} - Ngày trả phòng:{" "}
                    {booking.check_out_date}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <BiCheckCircle className="text-blue-500" />
                  <span>
                    Trạng thái:{" "}
                    {booking.booking_status === "confirmed"
                      ? "Xác nhận"
                      : booking.booking_status === "pending"
                      ? "Đang chờ"
                      : "Hủy"}
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <Link
                  to={`/bookings/${hotelId}/${booking.booking_id}/details`} // Đường dẫn chi tiết đặt phòng
                  className="bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
                >
                  Chi tiết đặt phòng
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bookings;
