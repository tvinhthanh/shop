import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../../api-client"; 
import { useAppContext } from "../../contexts/AppContext";
import Slider from "react-slick";

const Sanpham: React.FC = () => {
  const { storeId } = useAppContext();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);

  if (!storeId) {
    return <span>Mã cửa hàng bị mất hoặc đang không tìm thấy.</span>;
  }

  // Fetch products
  const { data: productData, isLoading, isError } = useQuery(
    ['fetchProducts', storeId],
    () => apiClient.getProductsByStore(storeId),
    {
      onError: (error) => console.error('Error fetching products:', error),
    }
  );

  // Delete mutation
  const deleteProductMutation = useMutation(
    (productId: string) => apiClient.deleteProductById(productId),
    {
      onSuccess: () => queryClient.invalidateQueries(['fetchProducts', storeId]),
      onError: (error) => console.error('Error deleting product:', error),
    }
  );

  // Update mutation
//   const updateProductMutation = useMutation(
//     (data: { product_id: string; name: string; price: number; stock: number,  description: string;
//     }) =>
//       apiClient.updateProduct(data),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['fetchProducts', storeId]);
//         setIsDialogOpen(false);
//         alert("Cập nhật sản phẩm thành công!");
//       },
//       onError: (error) => {
//         console.error('Error updating product:', error);
//         alert("Không thể cập nhật sản phẩm, vui lòng thử lại.");
//       },
//     }
//   );

  // Handle delete
  const handleDelete = (productId: number) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      deleteProductMutation.mutate(productId.toString());
    }
  };

  // Open edit dialog
  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditStock(product.stock);
    setIsDialogOpen(true);
  };

  // Submit edit
  const handleEditSubmit = () => {
    if (!selectedProduct) return;

    const updatedProduct = {
      product_id: selectedProduct.product_id,
      name: editName.trim(),
      price: editPrice,
      stock: editStock,
    };

    // updateProductMutation.mutate(updatedProduct);
  };

  if (isLoading) return <span>Loading...</span>;
  if (isError || !productData || productData.length === 0) {
    return (
      <div className="flex justify-between items-center bg-gray-100 p-6 rounded-lg shadow-lg">
        <div>
          <p className="text-xl font-semibold text-gray-700">Không có sản phẩm nào.</p>
          <p className="text-sm text-gray-500">Vui lòng thêm sản phẩm mới để quản lý.</p>
        </div>
        <Link
          to={`/themsanpham`}
          className="bg-blue-600 text-white text-lg font-bold py-2 px-4 rounded-lg hover:bg-blue-500"
        >
          Thêm sản phẩm
        </Link>
      </div>
    );
  }
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const parseImages = (imageData: any) => {
    try {
      // Parse JSON string if image data is in JSON format
      const images = JSON.parse(imageData);
      return Array.isArray(images) ? images : [images];
    } catch (error) {
      console.error('Error parsing images:', error);
      return [];
    }
  };
  
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Danh sách sản phẩm</h1>
        <Link
          to={`/addsanpham`}
          className="bg-black text-white text-xl font-bold p-2 hover:bg-black-500"
        >
          Thêm sản phẩm
        </Link>
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left">Tên sản phẩm</th>
              <th className="py-3 px-4 text-left">Hình ảnh</th>
              <th className="py-3 px-4 text-left">Giá</th>
              <th className="py-3 px-4 text-left">Tồn kho</th>
              <th className="py-3 px-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {productData.map((product: any) => (
              <tr key={product.product_id} className="border-b">
                <td className="py-3 px-4">{product.product_name}</td>
                <td className="py-3 px-4">
                    <img src={product.image} alt="Product Image" className="w-20 h-20 object-cover" />
                </td>                   
                <td className="py-3 px-4">{product.price}</td>
                <td className="py-3 px-4">{product.stock}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-600 text-white text-sm font-bold py-1 px-4 rounded-lg hover:bg-blue-500"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(product.product_id)}
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
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa sản phẩm</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Tên sản phẩm</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Giá</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Tồn kho</label>
              <input
                type="number"
                value={editStock}
                onChange={(e) => setEditStock(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
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

export default Sanpham;
