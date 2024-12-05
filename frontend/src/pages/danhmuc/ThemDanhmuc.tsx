import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from "../../api-client";
import { useNavigate } from "react-router-dom";

const AddCategory: React.FC = () => {
  const { storeId } = useAppContext();
  if (!storeId) {
    return <span>Mã cửa hàng bị mất hoặc đang không tìm thấy.</span>;
  }
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  const createCategoryMutation = useMutation(
    (data: { category_name: string; description: string; store_id: string }) =>
      apiClient.createCategory(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fetchMyCategories", storeId]);
        navigate(`/${storeId}/danhmuc`);
      },
      onError: (error) => {
        console.error("Error creating category:", error);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      category_name: categoryName,
      description,
      store_id: storeId,
    };

    try {
      await createCategoryMutation.mutateAsync(data);
      alert("Thêm danh mục thành công!");
      navigate(`/categories`);
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      alert("Không thể thêm danh mục, vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Thêm danh mục mới</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="categoryName"
          >
            Tên danh mục
          </label>
          <input
            id="categoryName"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="description"
          >
            Mô tả
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white font-bold py-2 px-4 rounded hover:bg-black-500"
        >
          Thêm danh mục
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
