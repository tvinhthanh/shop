import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as apiClient from "../../api-client"; // Thư viện gọi API
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const Themsp: React.FC = () => {
  const { storeId } = useAppContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // State for form input
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);  // Changed to hold a single file

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError } = useQuery(
    ['fetchCategories', storeId],
    () => apiClient.getCategoriesByStore(storeId as string), // API lấy danh mục theo cửa hàng
    {
      onError: (error) => {
        console.error('Error fetching categories:', error);
      }
    }
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);  // Store only one image
    }
  };

  // Mutation to create product
  const createProductMutation = useMutation(
    async (formData: FormData) => apiClient.createProduct(formData), // API để tạo sản phẩm
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['fetchProducts', storeId]); // Invalidate cache to refetch data
        alert("Sản phẩm đã được thêm thành công!");
        navigate('/sanpham')
      },
      onError: (error) => {
        console.error('Error adding product:', error);
        alert("Không thể thêm sản phẩm, vui lòng thử lại.");
      }
    }
  );

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName || price <= 0 || stock < 0 || !categoryId || !image) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product_name", productName.trim());
      formData.append("price", price.toString());
      formData.append("stock", stock.toString());
      formData.append("description", description.trim());
      formData.append("category_id", categoryId.toString());
      formData.append("store_id", storeId as string );
      
      // Append the single image to FormData
      formData.append("image", image, image.name);  // Append the selected image

      // Call mutation to create product
      createProductMutation.mutate(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Không thể thêm sản phẩm, vui lòng thử lại.');
    }
  };

  if (isCategoriesLoading) {
    return <span>Loading categories...</span>;
  }

  if (isCategoriesError) {
    return <span>Error loading categories</span>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Thêm Sản Phẩm</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tên sản phẩm</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Giá</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
            required
            min={0}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Số lượng</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
            required
            min={0}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value={0}>Chọn danh mục</option>
            {categories?.map((category: any) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="image" className="text-sm font-semibold">Hình Ảnh:</label>
          <input
            id="image"
            type="file"
            onChange={handleImageChange}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            accept="image/*"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Thêm sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default Themsp;
