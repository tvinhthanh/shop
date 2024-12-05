import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import * as apiClient from "../../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { useAppContext } from "../../contexts/AppContext";

const Danhmuc = () => {
  const { storeId } = useAppContext();
  const navigate = useNavigate();

  // Fetch categories data
  const { data: categoryData, isLoading, isError } = useQuery(
    "fetchCategories",
    () => apiClient.getCategoriesByStore(storeId ?? ""),
    {
      onError: () => {
        // Handle error state if necessary
      },
    }
  );

  const handleDelete = (categoryId: string) => {
    // Confirm the deletion action
    const confirmDelete = window.confirm("Bạn chắc chắn muốn xóa danh mục này?");

    if (confirmDelete) {
      // Call your API to delete the category
      apiClient.deleteCategoryById(categoryId)
        .then(() => {
          alert("Danh mục đã được xóa thành công!");
          // Optionally, you can redirect the user after deletion:
          navigate("/danh-muc"); // Redirect to categories list or another page
        })
        .catch(error => {
          console.error("Error deleting category:", error);
          alert("Có lỗi xảy ra khi xóa danh mục.");
        });
    }
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError || !categoryData) {
    return (
      <span>
        Không tìm thấy danh mục
        <Link
          to="/add-category"
          className="flex bg-black text-white text-xl font-bold p-2 hover:bg-red"
        >
          Thêm danh mục
        </Link>
      </span>
    );
  }

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">Danh mục của tôi</h1>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {categoryData.map((category: any) => (
          <div
            data-testid="category-card"
            key={category.category_id}
            className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
          >
            <h2 className="text-2xl font-bold">{category.category_name}</h2>

            <p className="text-sm">{category.description}</p>

            <div className="grid grid-cols-2 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1" />
                Created At: {new Date(category.createdAt).toLocaleDateString()}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1" />
                Updated At: {new Date(category.updatedAt).toLocaleDateString()}
              </div>
            </div>

            <span className="flex justify-end space-x-4">
              <Link
                to={`/edit-category/${category.category_id}`} // Link to edit category
                className="flex bg-black text-white text-xl font-bold p-2 hover:bg-green-500"
              >
                Chỉnh sửa
              </Link>
              <button
                onClick={() => handleDelete(category.category_id)} // Function to handle the delete action
                className="flex bg-black text-white text-xl font-bold p-2 hover:bg-red-500"
              >
                Xóa danh mục
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Danhmuc;
