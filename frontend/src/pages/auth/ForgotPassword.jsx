import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { apiClient } from "../../api/apiConfig";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      // Call public forgot-password endpoint.
      const response = await apiClient.post("/auth/forgot-password", {
        email: data.email,
      });

      alert(response?.data?.message || "Reset link sent");
    } catch (error) {
      alert(error?.response?.data?.message || error?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Back to{" "}
            <Link to="/signin" className="text-blue-500 hover:text-blue-700 font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
