import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../../api-client"; 
import { useAppContext } from "../../contexts/AppContext";

const Danhmuc: React.FC = () => {
  const { storeId } = useAppContext();
  const queryClient = useQueryClient();

  // State for edit dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  if (!storeId) {
    return <span>Mã cửa hàng bị mất hoặc đang không tìm thấy.</span>;
  }

  // Fetch categories
  const { data: categoryData, isLoading, isError } = useQuery(
    ['fetchMyCategories', storeId],
    () => apiClient.getCategoriesByStore(storeId),
    {
      onError: (error) => {
        console.error('Error fetching categories:', error);
      }
    }
  );

  // Delete mutation
  const deleteCategoryMutation = useMutation(
    (categoryId: string) => apiClient.deleteCategoryById(categoryId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['fetchMyCategories', storeId]);
      },
      onError: (error) => {
        console.error('Error deleting category:', error);
      }
    }
  );

  // Update mutation
  const updateCategoryMutation = useMutation(
    (data: { category_id: string; category_name: string; description: string }) =>
      apiClient.updateCategory(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['fetchMyCategories', storeId]);
        setIsDialogOpen(false);
        alert("Cập nhật danh mục thành công!");
      },
      onError: (error) => {
        console.error('Error updating category:', error);
        alert("Không thể cập nhật danh mục, vui lòng thử lại.");
      }
    }
  );

  // Handle delete
  const handleDelete = (categoryId: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(categoryId.toString());
    }
  };

  // Open edit dialog
  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setEditName(category.category_name);
    setEditDescription(category.description);
    setIsDialogOpen(true);
  };

  // Submit edit
  const handleEditSubmit = () => {
    if (!selectedCategory) return;

    const updatedCategory = {
      category_id: selectedCategory.category_id,
      category_name: editName.trim(),
      description: editDescription.trim(),
    };

    updateCategoryMutation.mutate(updatedCategory);
  };

  if (isLoading) return <span>Loading...</span>;
  if (isError || !categoryData || categoryData.length === 0) {
    return (
      <div className="flex justify-between items-center bg-gray-100 p-6 rounded-lg shadow-lg">
        <div>
          <p className="text-xl font-semibold text-gray-700">Không có danh mục nào.</p>
          <p className="text-sm text-gray-500">Vui lòng thêm danh mục mới để quản lý.</p>
        </div>
        <Link
          to={`/store/${storeId}/add-category`}
          className="bg-blue-600 text-white text-lg font-bold py-2 px-4 rounded-lg hover:bg-blue-500"
        >
          Thêm danh mục
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Các danh mục</h1>
        <Link
          to={`/${storeId}/add-danhmuc`}
          className="bg-black text-white text-xl font-bold p-2 hover:bg-black-500"
        >
          Thêm danh mục
        </Link>
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left">Tên danh mục</th>
              <th className="py-3 px-4 text-left">Mô tả</th>
              <th className="py-3 px-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categoryData.map((category: any) => (
              <tr key={category.category_id} className="border-b">
                <td className="py-3 px-4">{category.category_name}</td>
                <td className="py-3 px-4">{category.description}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-blue-600 text-white text-sm font-bold py-1 px-4 rounded-lg hover:bg-blue-500"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(category.category_id)}
                    className="bg-red-600 text-white text-sm font-bold py-1 px-4 rounded-lg hover:bg-red-500 ml-2"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa danh mục</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Tên danh mục</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Mô tả</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows={4}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mr-2"
              >
                Hủy
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Danhmuc;
