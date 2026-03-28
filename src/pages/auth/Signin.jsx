import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Invalid email or password");
        return;
      }

      login(result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);

      if (result.role === "ADMIN") navigate("/admin");
      else if (result.role === "LAWYER") navigate("/lawyer");
      else if (result.role === "NGO") navigate("/ngo");
      else navigate("/citizen");

    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          <input {...register("email")} placeholder="Email" className="mb-4 w-full px-3 py-2 border rounded-lg"/>
          <p className="text-red-500 text-sm">{errors.email?.message}</p>

  <div className="mb-4 relative">
  <input
    {...register("password")}
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full px-3 py-2 border rounded-lg pr-10"
  />

  <span
    className="absolute right-3 top-3 cursor-pointer text-gray-600"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

          <p className="text-red-500 text-sm">{errors.password?.message}</p>

          {/* Forgot Password */}
          <div className="text-right mb-4">
            <Link to="/forgot-password" className="text-blue-500 text-sm">
              Forgot Password?
            </Link>
          </div>

          <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
            Sign In
          </button>

          <p className="text-center mt-4 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500">Register</Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Signin;