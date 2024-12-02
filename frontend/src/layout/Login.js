import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const { showToast, setUserData } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const { register, formState: { errors }, handleSubmit } = useForm();

  // Mutation to call the sign-in API
  const mutation = useMutation(
    async (data) => {
      try {
        // "data" here contains the email and password from the form
        const response = await axios.post("http://localhost:5000/api/auth/login", data);
        const { token } = response.data;

        // Call the validate-token API with the token
        const validateResponse = await axios.post(
          "http://localhost:5000/api/auth/validate-token",
          { token }
        );

        if (validateResponse.data.valid) {
          const { id_user, role } = response.data;
          setUserData(id_user, role); // Set the user data in context
          showToast({ message: "Đăng nhập thành công!", type: "SUCCESS" });

          // Invalidate queries and navigate to the previous page or home
          await queryClient.invalidateQueries("validateToken");
          navigate(location.state?.from?.pathname || "/");
        } else {
          showToast({ message: "Token không hợp lệ", type: "ERROR" });
        }
      } catch (error) {
        // Handle errors here (e.g., wrong credentials, server issues)
        showToast({
          message: error.response?.data?.message || "Đăng nhập thất bại",
          type: "ERROR",
        });
      }
    },
    {
      onError: (error) => {
        showToast({ message: error.message, type: "ERROR" });
      },
    }
  );

  // Handle form submission
  const onSubmit = (data) => mutation.mutate(data);

  return (
    <form className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-3xl font-bold text-center mb-6">Đăng nhập</h2>

      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700">Email</label>
        <input
          type="email"
          className="w-full px-3 py-2 border rounded-md"
          {...register("email", { required: "Email là bắt buộc" })}
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700">Mật khẩu</label>
        <input
          type="password"
          className="w-full px-3 py-2 border rounded-md"
          {...register("password", {
            required: "Mật khẩu là bắt buộc",
            minLength: {
              value: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự",
            },
          })}
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm">
          Chưa có tài khoản?{" "}
          <Link className="underline text-blue-600" to="/register">
            Đăng ký tại đây
          </Link>
        </span>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
        >
          Đăng nhập
        </button>
      </div>
    </form>
  );
};

export default Login;
