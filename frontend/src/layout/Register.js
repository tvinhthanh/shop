import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation after successful registration

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Watch the password value to compare it with confirmPassword
  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Sending registration data to the backend API
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        FullName: data.fullName,           // Full Name
        Email: data.email,                 // Email
        Phone: data.phone,                 // Phone
        Address: data.address,             // Address
        Password: data.password,           // Sending plain password here
        ConfirmPassword: data.confirmPassword, // Confirm password for backend check
        role: "1",                         // Default role, assuming '1' represents a user
      });
  
      // Handle successful registration
      alert("Registration successful");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      // Handle error from the backend
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-lg w-full sm:w-96" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-2xl font-bold mb-4 text-center">Đăng ký tài khoản</h2>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700" htmlFor="fullName">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            className="w-full p-2 border border-gray-300 rounded"
            {...register("fullName", { required: "Full name is required" })}
          />
          {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName.message}</span>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded"
            {...register("email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Invalid email address" } })}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700" htmlFor="phone">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            className="w-full p-2 border border-gray-300 rounded"
            {...register("phone", { required: "Phone number is required" })}
          />
          {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700" htmlFor="address">
            Address
          </label>
          <input
            type="text"
            id="address"
            className="w-full p-2 border border-gray-300 rounded"
            {...register("address", { required: "Address is required" })}
          />
          {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border border-gray-300 rounded"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            })}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full p-2 border border-gray-300 rounded"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: value => value === password || "Passwords do not match"
            })}
          />
          {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
};

export default Register;
