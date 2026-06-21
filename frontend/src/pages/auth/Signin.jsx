import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff } from "lucide-react";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

function Signin() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "/api";

  // Runs when user clicks Sign In
  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const text = await response.text();
      let result = {};
      try {
        result = text ? JSON.parse(text) : {};
      } catch (_) {
        result = { message: text };
      }

      if (!response.ok) {
        const message = result?.message || result?.error || response.statusText || "Login failed";
        alert(message);
        return;
      }

      if (!result?.accessToken) {
        alert(result?.message || "Login failed");
        return;
      }

      // Save token using AuthContext
      login(result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      localStorage.setItem("userName", result.name);
      if (result.role) {
        localStorage.setItem("role", result.role);
        localStorage.setItem("userRole", result.role);
      }
      if (result.userId) localStorage.setItem("userId", String(result.userId));

      if (result.role === "ADMIN") {
        navigate("/admin");
      } else if (result.role === "LAWYER") {
        navigate("/lawyer");
      } else if (result.role === "NGO") {
        navigate("/ngo");
      } else {
        navigate("/citizen");
      }

    } catch (error) {
      console.error("Login error:", error);
      const message = error?.message || "Login failed. Please try again.";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Sign In
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Email
            </label>

            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />

            <p className="text-red-500 text-sm mt-1">
              {errors.email?.message}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg"
              />

              {/* Toggle password visibility without affecting form submission */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="text-red-500 text-sm mt-1">
              {errors.password?.message}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Sign In
          </button>

          {/* Removed Forgot Password action as requested; login flow and password toggle remain unchanged. */}

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Register
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Signin;
