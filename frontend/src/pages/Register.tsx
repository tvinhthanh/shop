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
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Tạo tài khoản</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          Họ
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("firstName", { required: "This field is required" })}
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Tên
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("lastName", { required: "This field is required" })}
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This field is required" })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Số điện thoại
        <input
          type="tel"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("phone", {
            required: "This field is required",
            pattern: {
              value: /^[0-9]{10}$/, // Assuming a 10-digit phone number format
              message: "Invalid phone number",
            },
          })}
        />
        {errors.phone && (
          <span className="text-red-500">{errors.phone.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Mật khẩu
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Nhập lại mật khẩu
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
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
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Địa chỉ
        <input
          type="text"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("address", { required: "This field is required" })}
        />
        {errors.address && (
          <span className="text-red-500">{errors.address.message}</span>
        )}
      </label>
      
      {/* Chọn vai trò người dùng */}
      <label className="text-gray-700 text-sm font-bold">
        Vai trò
        <select
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("role", { required: "Please select a role" })}
        >
          <option value="1">Chủ khách sạn</option>
          <option value="2">Người dùng</option>
        </select>
        {errors.role && (
          <span className="text-red-500">{errors.role.message}</span>
        )}
      </label>
      
      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Tạo Tài Khoản
        </button>
      </span>
    </form>
  );
};

export default Register;
