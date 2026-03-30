import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { apiClient } from "../../api/apiConfig";

const schema = yup.object({
  token: yup.string().required("Reset token is required"),
  newPassword: yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

function ResetPassword() {
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      token: searchParams.get("token") || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Reset password with token and new password.
      const response = await apiClient.post("/auth/reset-password", {
        token: data.token,
        newPassword: data.newPassword,
      });

      alert(response?.data?.message || "Password updated successfully");
    } catch (error) {
      alert(error?.response?.data?.message || error?.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Reset Token</label>
            <input
              {...register("token")}
              onChange={(e) => setValue("token", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-red-500 text-sm mt-1">{errors.token?.message}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">New Password</label>
            <input
              {...register("newPassword")}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-red-500 text-sm mt-1">{errors.newPassword?.message}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword?.message}</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-60"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
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

export default ResetPassword;
