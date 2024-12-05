import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {
  HotelSearchResponse,
  HotelType,
  PaymentIntentResponse,
  RoomType,
  StoreType,
  UserType,
} from "./types";
import { BookingFormData } from "./forms/BookingForm/BookingForm";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// export const fetchCurrentUser = async (): Promise<UserType> => {
//   const response = await fetch(`${API_BASE_URL}/api/users/me`, {
//     credentials: "include",
//   });
//   if (!response.ok) {
//     throw new Error("Error fetching user");
//   }
//   return response.json();
// };



export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const register = async (formData: RegisterFormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  
    if (!response.ok) {
      let errorMessage = "An error occurred while processing your request.";
      try {
        const responseBody = await response.json();
        errorMessage = responseBody?.message || errorMessage;
      } catch (err) {
        console.error("Error parsing response body:", err);
      }
      throw new Error(errorMessage);
    }
  
    const responseBody = await response.json();
    return responseBody;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message); // Log to the console for debugging
      throw new Error(error.message);
    }
    throw new Error("Something went wrong.");
  }  
};

export const validateToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
      credentials: "include",  // Include credentials like cookies (if needed)
    });

    if (!response.ok) {
      // Log the response status and body for debugging purposes
      const errorDetails = await response.text();
      console.error("Token validation failed: ", errorDetails);
      throw new Error("Token is invalid or expired.");
    }

    // Return the parsed JSON response
    return response.json();
  } catch (error) {
    console.error("Error during token validation: ", error);
    throw new Error("Something went wrong during token validation.");
  }
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const addMyStore = async (formData: FormData) => {
  try {
    // Gửi formData lên API
    const response = await fetch(`${API_BASE_URL}/api/store`, {
      method: 'POST',
      body: formData, // Gửi formData thay vì JSON
    });

    // Kiểm tra xem phản hồi có thành công không
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add hotel');
    }

    // Trả về dữ liệu thành công nếu có
    const data = await response.json();
    return data;
  } catch (error) {
    // Xử lý lỗi khi gửi hoặc nhận phản hồi
    console.error('Error adding hotel:', error);
    throw error;
  }
};

export const addMyHotel = async (formData: FormData) => {
  try {
    // Gửi formData lên API
    const response = await fetch(`${API_BASE_URL}/api/hotel`, {
      method: 'POST',
      body: formData, // Gửi formData thay vì JSON
    });

    // Kiểm tra xem phản hồi có thành công không
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add hotel');
    }

    // Trả về dữ liệu thành công nếu có
    const data = await response.json();
    return data;
  } catch (error) {
    // Xử lý lỗi khi gửi hoặc nhận phản hồi
    console.error('Error adding hotel:', error);
    throw error;
  }
};



export const fetchMyStores = async (userId: string): Promise<StoreType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/store/user/${userId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};


export const deleteCategoryById = async (categoryId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/category/${categoryId}`, {
      method: 'DELETE', // Use the DELETE method to remove the hotel
    });

    if (!response.ok) {
      throw new Error('Failed to delete hotel');
    }

    const result = await response.json();
    return result; // You can return the result to handle the success message on the frontend
  } catch (error) {
    console.error('Error deleting hotel:', error);
    throw error; // You can throw the error or return a custom message to the frontend
  }
};

export const getCategoriesByStore = async (storeId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/category/store/${storeId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the JSON data from the response
    return data; // Return the parsed data
  } catch (error) {
    console.error('Error fetching categories by store:', error);
    throw error; // Re-throw error to be handled in the component
  }
};

export const getStoreById = async (storeId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/store/${storeId}`); // Adjust the URL to your API endpoint
  if (!response.ok) {
    throw new Error('Failed to fetch hotel data');
  }
  const data = await response.json();
  return data; // Assuming your API responds with the hotel data
};

export const updateStoreById = async (storelId: string, formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/store/${storelId}`, {
    method: 'PUT', // Use the PUT method for update
    headers: {
      // No need for Content-Type when sending FormData
      // Content-Type: 'multipart/form-data', // this is set automatically with FormData
    },
    body: formData, // Send the FormData with the hotel details
  });

  if (!response.ok) {
    throw new Error('Failed to update hotel');
  }

  const data = await response.json();
  return data; // Assuming your API responds with updated hotel data
};

export const deleteStoreById = async (storeId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/store/${storeId}`, {
      method: 'DELETE', // Use the DELETE method to remove the hotel
    });

    if (!response.ok) {
      throw new Error('Failed to delete hotel');
    }

    const result = await response.json();
    return result; // You can return the result to handle the success message on the frontend
  } catch (error) {
    console.error('Error deleting hotel:', error);
    throw error; // You can throw the error or return a custom message to the frontend
  }
};

export const createProduct = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      body: formData, // Chuyển FormData vào body
    });

    // Kiểm tra xem phản hồi có thành công không
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server Error:', errorData); // In lỗi server ra console
      throw new Error(errorData.message || 'Failed to add product');
    }

    // Nếu thành công, lấy dữ liệu trả về từ API
    const data = await response.json();
    console.log('Product created successfully:', data); // In ra dữ liệu sản phẩm mới
    return data; // Trả về dữ liệu sản phẩm được tạo hoặc thông báo thành công
  } catch (error) {
    // Xử lý lỗi
    console.error('Error creating product:', error);
    throw error; // Ném lại lỗi để xử lý trong component
  }
};


export const getProductsByStore = async (storeId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/store/${storeId}`);
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the JSON data from the response
    return data; // Return the parsed data
  } catch (error) {
    console.error('Error fetching products by store:', error);
    throw error; // Re-throw error to be handled in the component
  }
};
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    
    // Check if the response is successful (status code 2xx)
    if (!response.ok) {
      throw new Error(`Failed to fetch products, status: ${response.status}`);
    }

    const data = await response.json(); // Parse the response as JSON
    return data;  // Return the product data from the API response
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // You can handle the error as needed in your application
  }
};
export const deleteProductById = async (productId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: 'DELETE', // Sử dụng DELETE để xóa sản phẩm
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    const result = await response.json(); // Parse response (nếu có)
    return result; // Trả về kết quả
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error; // Re-throw error để xử lý tại component
  }
};
export const updateProduct = async (productData: {
  product_id: string;
  product_name: string;
  price: number;
  stock: number;
  description: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${productData.product_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData), // Gửi dữ liệu sản phẩm dưới dạng JSON
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    const result = await response.json(); // Parse response
    return result; // Trả về kết quả
  } catch (error) {
    console.error('Error updating product:', error);
    throw error; // Re-throw error để xử lý tại component
  }
};

export const createCategory = async (data: {
  category_name: string;
  description: string;
  store_id: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create category");
  }

  return response.json();

};

export const updateCategory = async (data: {
  category_id: string;
  category_name: string;
  description: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/category/${data.category_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category_name: data.category_name,
        description: data.description,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update category. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteHotelById = async (hotelId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/hotel/${hotelId}`, {
      method: 'DELETE', // Use the DELETE method to remove the hotel
    });

    if (!response.ok) {
      throw new Error('Failed to delete hotel');
    }

    const result = await response.json();
    return result; // You can return the result to handle the success message on the frontend
  } catch (error) {
    console.error('Error deleting hotel:', error);
    throw error; // You can throw the error or return a custom message to the frontend
  }
};
export type SearchParams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

// export const searchHotels = async (
//   searchParams: SearchParams
// ): Promise<HotelSearchResponse> => {
//   const queryParams = new URLSearchParams();
//   queryParams.append("destination", searchParams.destination || "");
//   queryParams.append("checkIn", searchParams.checkIn || "");
//   queryParams.append("checkOut", searchParams.checkOut || "");
//   queryParams.append("adultCount", searchParams.adultCount || "");
//   queryParams.append("childCount", searchParams.childCount || "");
//   queryParams.append("page", searchParams.page || "");

//   queryParams.append("maxPrice", searchParams.maxPrice || "");
//   queryParams.append("sortOption", searchParams.sortOption || "");

//   searchParams.facilities?.forEach((facility) =>
//     queryParams.append("facilities", facility)
//   );

//   searchParams.types?.forEach((type) => queryParams.append("types", type));
//   searchParams.stars?.forEach((star) => queryParams.append("stars", star));

//   const response = await fetch(
//     `${API_BASE_URL}/api/hotels/search?${queryParams}`
//   );

//   if (!response.ok) {
//     throw new Error("Error fetching hotels");
//   }

//   return response.json();
// };

export const fetchHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/hotel`);
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }
  return response.json();
};

// export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
//   const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
//   if (!response.ok) {
//     throw new Error("Error fetching Hotels");
//   }

//   return response.json();
// };

// export const createPaymentIntent = async (
//   hotelId: string,
//   numberOfNights: string
// ): Promise<PaymentIntentResponse> => {
//   const response = await fetch(
//     `${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`,
//     {
//       credentials: "include",
//       method: "POST",
//       body: JSON.stringify({ numberOfNights }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Error fetching payment intent");
//   }

//   return response.json();
// };

export const createRoomBooking = async (formData: BookingFormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("Error booking room");
  }
};

// export const fetchMyBookings = async (): Promise<HotelType[]> => {
//   const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
//     credentials: "include",
//   });

//   if (!response.ok) {
//     throw new Error("Unable to fetch bookings");
//   }

//   return response.json();
// };
