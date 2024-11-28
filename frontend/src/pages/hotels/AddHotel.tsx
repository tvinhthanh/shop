import React, { useState } from 'react';
import * as apiClient from '../../api-client'; // Import your API client functions
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

export const HotelType = [
  "Bình dân",
  "Nhỏ sang trọng",
  "Cao cấp",
  "Khu nghỉ dưỡng trượt tuyết",
  "Dành cho doanh nhân",
  "Gia đình",
  "Lãng mạn",
  "Khu nghỉ dưỡng leo núi",
  "Nhà gỗ nghỉ dưỡng",
  "Khu nghỉ dưỡng bãi biển",
  "Khu nghỉ dưỡng chơi golf",
  "Nhà nghỉ ven đường",
  "Trọn gói",
  "Cho phép thú cưng",
  "Tự phục vụ"
];

export const Facilities = [
  "WiFi miễn phí",
  "Bãi đỗ xe",
  "Dịch vụ đưa đón sân bay",
  "Phòng gia đình",
  "Phòng không hút thuốc",
  "Hồ bơi ngoài trời",
  "Spa",
  "Trung tâm thể dục"
];


const AddHotel: React.FC = () => {
  const { userId } = useAppContext();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [rating, setRating] = useState('');
  const [image, setImage] = useState<File | null>(null); // State for image file

  const navigate = useNavigate();
  console.log('User ID:', userId); // Log to see if userId is correct

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setImage(file);
    }
  };

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
  
    // Append image only if selected
    if (image) {
      formData.append('image', image);
    } else {
      formData.append('image', '');  // Empty value to avoid sending null
    }
  
    try {
      await apiClient.addMyHotel(formData); // Send FormData to API client
      alert('Hotel added successfully!');
      navigate(`/my-hotels`);
    } catch (error) {
      console.error('Error adding hotel:', error);
      alert('Failed to add hotel');
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add Hotel</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-semibold">
            Name:
          </label>
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
          <label htmlFor="address" className="text-sm font-semibold">
            Address:
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
          <label htmlFor="city" className="text-sm font-semibold">
            City:
          </label>
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
          <label htmlFor="country" className="text-sm font-semibold">
            Country:
          </label>
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
          <label htmlFor="phone" className="text-sm font-semibold">
            Phone:
          </label>
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
          <label htmlFor="rating" className="text-sm font-semibold">
            Rating:
          </label>
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
          <label htmlFor="image" className="text-sm font-semibold">
            Image:
          </label>
          <input
            id="image"
            type="file"
            onChange={handleImageChange}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            accept="image/*" // Restrict file types to images
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Add Hotel
        </button>
      </form>
    </div>
  );
};

export default AddHotel;
