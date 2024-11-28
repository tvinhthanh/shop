import React, { useState, useEffect } from 'react';
import * as apiClient from '../../api-client'; // Import your API client functions
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate, useParams } from 'react-router-dom';

const EditHotel: React.FC = () => {
  const { userId } = useAppContext();
  const navigate = useNavigate();
  const { hotelId } = useParams<{ hotelId: string }>(); // Use the hotelId from the URL

  // States for hotel data
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [rating, setRating] = useState('');
  const [image, setImage] = useState<File | null>(null); // State for image file
  const [currentImage, setCurrentImage] = useState(''); // To hold the current image URL
  const [room, setRoom] = useState(0); // State for the number of rooms

  // Fetch hotel data on initial render
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        if (!hotelId) return;
        const hotelData = await apiClient.getHotelById(hotelId);
        setName(hotelData.name);
        setAddress(hotelData.address);
        setCity(hotelData.city);
        setCountry(hotelData.country);
        setPhone(hotelData.phone);
        setRating(hotelData.rating);
        setCurrentImage(hotelData.image); // Assuming hotelData contains the image URL
        setRoom(hotelData.room); // Assuming hotelData contains room count
      } catch (error) {
        console.error('Error fetching hotel data:', error);
        alert('Failed to fetch hotel data');
      }
    };
    fetchHotelData();
  }, [hotelId]);

  // Handle image file change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setImage(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if userId exists
    if (!userId) {
      alert('User ID is missing. Please log in.');
      return;
    }

    // Validate that all fields are filled
    if (!name || !address || !phone || !city || !country || !rating) {
      alert('Please fill in all fields.');
      return;
    }

    // Create FormData object to send image and other form data
    const formData = new FormData();
    formData.append('user_id', userId as string);
    formData.append('name', name);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('country', country);
    formData.append('rating', rating);
    formData.append('phone', phone);
    formData.append('hotel_id', hotelId as string);
    formData.append('room', String(room)); // Send room count without modifying it

    // Append image only if selected
    if (image) {
      formData.append('image', image);
    } else {
      formData.append('image', currentImage); // Keep the current image if no new one is uploaded
    }

    try {
      await apiClient.updateHotelById(hotelId as string, formData); // Send FormData to API client
      alert('Hotel updated successfully!');
      navigate(`/hotel/${hotelId}`);
    } catch (error) {
      console.error('Error updating hotel:', error);
      alert('Failed to update hotel');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Sửa thông tin khách sạn</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-semibold">Tên khách sạn:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="address" className="text-sm font-semibold">Địa chỉ:</label>
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
          <label htmlFor="city" className="text-sm font-semibold">Thành phố:</label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="country" className="text-sm font-semibold">Quốc gia:</label>
          <input
            id="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="phone" className="text-sm font-semibold">Sô điện thoai:</label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="rating" className="text-sm font-semibold">Đánh giá:</label>
          <input
            id="rating"
            type="text"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Add image input */}
        <div className="flex flex-col">
          <label htmlFor="image" className="text-sm font-semibold">Hình logo:</label>
          <input
            id="image"
            type="file"
            onChange={handleImageChange}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            accept="image/*" // Restrict file types to images
          />
        </div>

        {/* Show current image if available */}
        {currentImage && (
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Hình logo hiện tại:</label>
            <img src={currentImage} alt="Hotel" className="w-40 h-40 object-cover rounded-md" />
          </div>
        )}

        {/* Show the number of rooms */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Số phòng khách sạn hiện có: {room}</h2>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Cập nhật thông tin khách sạn
        </button>
      </form>
    </div>
  );
};

export default EditHotel;
