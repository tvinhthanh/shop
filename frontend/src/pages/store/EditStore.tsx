import React, { useState, useEffect } from "react";
import * as apiClient from "../../api-client"; // Import API client functions
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const EditStore: React.FC = () => {
  const { userId } = useAppContext();
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>(); // Use the storeId from the URL

  // States for store data
  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<File | null>(null); // State for image file
  const [currentImage, setCurrentImage] = useState(""); // To hold the current image URL

  // Fetch store data on initial render
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        if (!storeId) return;
        const storeData = await apiClient.getStoreById(storeId);
        setStoreName(storeData.store_name);
        setAddress(storeData.address);
        setPhone(storeData.phone);
        setCurrentImage(storeData.image); // Assuming storeData contains the image URL
      } catch (error) {
        console.error("Error fetching store data:", error);
        alert("Failed to fetch store data");
      }
    };
    fetchStoreData();
  }, [storeId]);

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
      alert("User ID is missing. Please log in.");
      return;
    }

    // Validate that all fields are filled
    if (!storeName || !address || !phone) {
      alert("Please fill in all fields.");
      return;
    }

    // Create FormData object to send image and other form data
    const formData = new FormData();
    formData.append("user_id", userId as string);
    formData.append("store_name", storeName);
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("store_id", storeId as string);

    // Append image only if selected
    if (image) {
      formData.append("image", image);
    } else {
      formData.append("image", currentImage); // Keep the current image if no new one is uploaded
    }

    try {
      await apiClient.updateStoreById(storeId as string, formData); // Send FormData to API client
      alert("Store updated successfully!");
      navigate(`/store/${storeId}`);
    } catch (error) {
      console.error("Error updating store:", error);
      alert("Failed to update store");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Sửa thông tin cửa hàng</h1>
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

        {/* Add image input */}
        <div className="flex flex-col">
          <label htmlFor="image" className="text-sm font-semibold">
            Hình ảnh:
          </label>
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
            <label className="text-sm font-semibold">Hình ảnh hiện tại:</label>
            <img src={currentImage} alt="Store" className="w-40 h-40 object-cover rounded-md" />
          </div>
        )}

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-black-600"
        >
          Cập nhật thông tin cửa hàng
        </button>
      </form>
    </div>
  );
};

export default EditStore;
