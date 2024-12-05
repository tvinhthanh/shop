import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { showToast, setUserData } = useAppContext(); // Get setUserData from context
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  // Mutation to call the sign-in API
  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async (data) => {
      const { id_user, role } = data; // Extract user data from the response
      setUserData(id_user, role); // Store user data in context

      showToast({ message: "Sign in Successful!", type: "SUCCESS" });

      // Invalidate token validation cache to refresh the user data
      await queryClient.invalidateQueries("validateToken");

      // Navigate to the original location or home page
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  // Handle form submission
  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);  // Call sign-in API
  });

  return (
    <form className="flex flex-col gap-3 p-4 max-w-sm mx-auto" onSubmit={onSubmit}>
      <h2 className="text-xl font-bold text-center mb-4">Đăng nhập</h2>
      <label className="text-gray-700 text-xs font-semibold">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 mt-1 text-sm"
          {...register("email", { required: "This field is required" })}
        ></input>
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-xs font-semibold mt-3">
        Mật khẩu
        <input
          type="password"
          className="border rounded w-full py-1 px-2 mt-1 text-sm"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        ></input>
        {errors.password && (
          <span className="text-red-500 text-xs">{errors.password.message}</span>
        )}
      </label>
      <span className="flex items-center justify-between mt-3 text-xs">
        <span className="text-sm">
          Chưa có tài khoản?{" "}
          <Link className="underline text-black-600" to="/register">
            Đăng ký tại đây
          </Link>
        </span>
        <button
          type="submit"
          className="bg-black text-white p-2 font-semibold hover:bg-blue-500 text-sm rounded"
        >
          Đăng nhập
        </button>
      </span>
    </form>
  );
};

export default SignIn;
