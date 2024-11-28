import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiDoorOpen, BiPhone, BiStar } from "react-icons/bi";

const ViewHotels = () => {
  // Fetch hotels data
  const { data: hotelData, isLoading, isError } = useQuery(
    "fetchHotels",
    apiClient.fetchHotels,
    {
      onError: () => {
        // Handle error state here if necessary
      },
    }
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError || !hotelData) {
    return (
      <span>
        Không tìm thấy khách sạn
      </span>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Danh sách khách sạn</h1>
      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel: any) => (
          <div
            key={hotel._id}
            className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
          >
            <h2 className="text-2xl font-bold">{hotel.name}</h2>

            {/* Check if the image URL exists and is valid */}
            {hotel.image ? (
               <img
               src={hotel.image}
               alt={hotel.name}
               className="w-full h-64 object-cover rounded-md mb-4"
             />  
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md mb-4">
                <span>No Image Available</span>
              </div>
            )}

            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1" />
                {hotel.address}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiDoorOpen className="mr-1" />có {hotel.room} phòng
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiPhone className="mr-1" />
                {hotel.phone}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiStar className="mr-1" />
                {hotel.rating} Star Rating
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to={`/rooms/${hotel.hotel_id}`} // Navigate to the room list for the selected hotel
                className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
              >
                Xem danh sách các phòng
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewHotels;
