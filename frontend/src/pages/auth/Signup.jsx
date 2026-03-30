import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "../../api/apiConfig";

const schema = yup.object({
  name: yup.string().required("Name is required"),

  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),

  role: yup
    .string()
    .oneOf(["Citizen", "Lawyer", "NGO", "Admin"])
    .required("Role is required"),

  specialization: yup.string().when("role", {
    is: "Lawyer",
    then: (schema) => schema.required("Specialization is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  location: yup.string().when("role", {
    is: "Lawyer",
    then: (schema) => schema.required("Location is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  licenseNumber: yup.string().when("role", {
    is: "Lawyer",
    then: (schema) => schema.required("License number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  adminInviteCode: yup.string().when("role", {
    is: "Admin",
    then: (schema) => schema.required("Admin invite code is required"),
    otherwise: (schema) => schema.notRequired(),
  })
});

function Signup() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await apiClient.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role.toUpperCase(),
        specialization: data.specialization || null,
        location: data.location || null,
        licenseNumber: data.licenseNumber || null,
        adminInviteCode: data.adminInviteCode || null,
      });

      alert("Registration successful! Please login.");
      navigate("/login");

    } catch (error) {
      console.error("Registration error:", error);
      alert(error?.response?.data?.message || error?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-red-500 text-sm">
              {errors.confirmPassword?.message}
            </p>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Role</label>
            <select
              {...register("role")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Role</option>
              <option value="Citizen">Citizen</option>
              <option value="Lawyer">Lawyer</option>
              <option value="NGO">NGO</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {watch("role") === "Lawyer" && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Specialization</label>
                <select
                  {...register("specialization")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Specialization</option>
                  <option value="Criminal">Criminal</option>
                  <option value="Civil">Civil</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Family">Family</option>
                  <option value="Property">Property</option>
                </select>
                <p className="text-red-500 text-sm">
                  {errors.specialization?.message}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Location</label>

                <select
                  {...register("location")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Location</option>
                  <option value="Bhopal">Bhopal</option>
                  <option value="Indore">Indore</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Other">Other</option>
                </select>

                {/* 👇 Show input if Other selected */}
                {watch("location") === "Other" && (
                  <input
                    {...register("location")}
                    placeholder="Enter your location"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                )}

                <p className="text-red-500 text-sm">
                  {errors.location?.message}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">License Number</label>
                <input
                  {...register("licenseNumber")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-red-500 text-sm">{errors.licenseNumber?.message}</p>
              </div>
            </>
          )}

          {watch("role") === "Admin" && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Admin Invite Code</label>
              <input
                {...register("adminInviteCode")}
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-red-500 text-sm">{errors.adminInviteCode?.message}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-700">
              Sign In
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Signup;