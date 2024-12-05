import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
  id_user?: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: number; 
  address: string;
  createAt?: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Success!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-4 p-4 max-w-md mx-auto" onSubmit={onSubmit}>
      <h2 className="text-xl font-bold text-center mb-3">Tạo tài khoản</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <label className="text-gray-700 text-xs font-semibold flex-1">
          Họ
          <input
            className="border rounded w-full py-1 px-2 text-sm"
            {...register("firstName", { required: "This field is required" })}
          />
          {errors.firstName && (
            <span className="text-red-500 text-xs">{errors.firstName.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-xs font-semibold flex-1">
          Tên
          <input
            className="border rounded w-full py-1 px-2 text-sm"
            {...register("lastName", { required: "This field is required" })}
          />
          {errors.lastName && (
            <span className="text-red-500 text-xs">{errors.lastName.message}</span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-xs font-semibold">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 text-sm"
          {...register("email", { required: "This field is required" })}
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-xs font-semibold">
        Số điện thoại
        <input
          type="tel"
          className="border rounded w-full py-1 px-2 text-sm"
          {...register("phone", {
            required: "This field is required",
            pattern: {
              value: /^[0-9]{10}$/, // Assuming a 10-digit phone number format
              message: "Invalid phone number",
            },
          })}
        />
        {errors.phone && (
          <span className="text-red-500 text-xs">{errors.phone.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-xs font-semibold">
        Mật khẩu
        <input
          type="password"
          className="border rounded w-full py-1 px-2 text-sm"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <span className="text-red-500 text-xs">{errors.password.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-xs font-semibold">
        Nhập lại mật khẩu
        <input
          type="password"
          className="border rounded w-full py-1 px-2 text-sm"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) {
                return "This field is required";
              } else if (watch("password") !== val) {
                return "Your passwords do not match";
              }
            },
          })}
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-xs font-semibold">
        Địa chỉ
        <input
          type="text"
          className="border rounded w-full py-1 px-2 text-sm"
          {...register("address", { required: "This field is required" })}
        />
        {errors.address && (
          <span className="text-red-500 text-xs">{errors.address.message}</span>
        )}
      </label>
      
      {/* Chọn vai trò người dùng */}
      <label className="text-gray-700 text-xs font-semibold">
        Vai trò
        <select
          className="border rounded w-full py-1 px-2 text-sm"
          {...register("role", { required: "Please select a role" })}
        >
          <option value="1">Chủ khách sạn</option>
          <option value="2">Người dùng</option>
        </select>
        {errors.role && (
          <span className="text-red-500 text-xs">{errors.role.message}</span>
        )}
      </label>
      
      <button
        type="submit"
        className="bg-black text-white p-2 font-semibold hover:bg-gray-800 text-lg rounded mt-4"
      >
        Tạo Tài Khoản
      </button>
    </form>
  );
};

export default Register;
