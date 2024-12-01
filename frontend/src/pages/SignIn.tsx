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
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Đăng nhập</h2>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This field is required" })}
        ></input>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
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
        ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <span className="flex items-center justify-between">
        <span className="text-sm">
          Chưa có tài khoản?{" "}
          <Link className="underline" to="/register">
            Đăng ký tại đây
          </Link>
        </span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Đăng nhập
        </button>
      </span>
    </form>
  );
};

export default SignIn;