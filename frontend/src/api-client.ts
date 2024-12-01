import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {
  HotelSearchResponse,
  HotelType,
  PaymentIntentResponse,
  RoomType,
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

export const addRoom = async (formData: FormData) => {
  try {
    // Gửi formData lên API
    const response = await fetch(`${API_BASE_URL}/api/room`, {
      method: 'POST',
      body: formData, // Gửi FormData thay vì JSON
    });

    // Kiểm tra phản hồi từ server
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add room');
    }

    // Trả về dữ liệu thành công nếu có
    const data = await response.json();
    return data;
  } catch (error) {
    // Xử lý lỗi khi gửi hoặc nhận phản hồi
    console.error('Error adding room:', error);
    throw error;
  }
};

export const fetchMyRooms = async (hotelId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/room/hotel/${hotelId}`, {
    credentials: "include", // Assuming you're handling cookies for authentication
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Error fetching rooms: ${errorMessage}`);
  }

  const data = await response.json();
  return data;
};
export const fetchRoom = async (hotelId: string, roomId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/room/${hotelId}/${roomId}`);
    const data = await response.json();
    console.log("Fetched room data:", data); // Kiểm tra dữ liệu trả về
    return data;
  } catch (error) {
    console.error("Error fetching room data:", error);
    throw error;
  }
};


export const fetchMyHotels = async (userId: string): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/hotel/user/${userId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const getHotelById = async (hotelId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/hotel/${hotelId}`); // Adjust the URL to your API endpoint
  if (!response.ok) {
    throw new Error('Failed to fetch hotel data');
  }
  const data = await response.json();
  return data; // Assuming your API responds with the hotel data
};

export const updateHotelById = async (hotelId: string, formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/hotel/${hotelId}`, {
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