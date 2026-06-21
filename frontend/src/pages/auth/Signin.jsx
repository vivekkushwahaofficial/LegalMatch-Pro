import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff, User, Mail, Lock, Shield, MapPin, Briefcase, Award, ArrowLeft, CheckCircle2 } from "lucide-react";
import { apiClient } from "../../api/apiConfig";

const signinSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const signupSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Confirm password is required"),
  role: yup.string().oneOf(["Citizen", "Lawyer", "NGO", "Admin"]).required("Role is required"),
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

function Signin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  // Sync mode based on router path
  const isRegisterRoute = location.pathname === "/register";
  const [isSignUp, setIsSignUp] = useState(isRegisterRoute);

  useEffect(() => {
    setIsSignUp(location.pathname === "/register");
  }, [location.pathname]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminInviteCode, setShowAdminInviteCode] = useState(false);

  // Form for Sign In
  const {
    register: registerSignin,
    handleSubmit: handleSubmitSignin,
    formState: { errors: errorsSignin },
  } = useForm({
    resolver: yupResolver(signinSchema),
  });

  // Form for Sign Up
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    watch: watchSignup,
    formState: { errors: errorsSignup },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const selectedRole = watchSignup("role");
  const watchLocation = watchSignup("location");

  const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "/api";

  const onSigninSubmit = async (data) => {
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

      login(result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      localStorage.setItem("userName", result.name);
      if (result.role) {
        localStorage.setItem("role", result.role);
        localStorage.setItem("userRole", result.role);
      }
      if (result.userId) localStorage.setItem("userId", String(result.userId));

      if (result.role === "ADMIN") navigate("/admin");
      else if (result.role === "LAWYER") navigate("/lawyer");
      else if (result.role === "NGO") navigate("/ngo");
      else navigate("/citizen");

    } catch (error) {
      console.error("Login error:", error);
      alert(error?.message || "Login failed. Please try again.");
    }
  };

  const onSignupSubmit = async (data) => {
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
      setIsSignUp(false);
      navigate("/login");

    } catch (error) {
      console.error("Registration error:", error);
      alert(error?.response?.data?.message || error?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 font-sans antialiased overflow-x-hidden">
      
      {/* Left Branding Panel (Desktop Only) */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 text-white p-12 xl:p-16">
        {/* Floating Decorative Blur Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[450px] h-[450px] bg-violet-600/30 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Top Header / Back Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-100 hover:text-white transition-colors group text-sm font-semibold">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="text-indigo-300" size={24} />
            <span className="font-bold tracking-wider text-indigo-100">LEGALMATCH PRO</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 my-auto max-w-lg space-y-8">
          <div className="space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 uppercase tracking-widest border border-white/10 inline-block">
              Auth Portal
            </span>
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
              {isSignUp ? "Empower Communities, Secure Rights." : "Bridging Legal Expertise & Social Need."}
            </h1>
            <p className="text-indigo-100/90 text-lg leading-relaxed">
              Connect with citizens, manage your cases, and drive social impact using India's premium pro-bono aid network.
            </p>
          </div>

          {/* Clean Platform Highlights (Replaces hardcoded testimonial) */}
          <div className="space-y-5 pt-6 border-t border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Verified Credentials</h3>
                <p className="text-xs text-indigo-200">100% credentialed lawyers, NGOs, and citizens for high trust matches.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Smart Match Intake</h3>
                <p className="text-xs text-indigo-200">Specialized category mapping connects the right case to the right expert.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Collaborative Workspaces</h3>
                <p className="text-xs text-indigo-200">Seamless chat, case monitoring, and document exchange for stakeholders.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-indigo-200/70 border-t border-white/10 pt-6">
          <span>© 2024 LegalMatch Pro</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-b from-indigo-50/20 via-slate-50 to-indigo-50/30 px-6 py-12 lg:px-8">
        
        {/* Floating background graphic for mobile/tablet */}
        <div className="lg:hidden absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-indigo-200/20 rounded-full blur-[60px] pointer-events-none" />
        <div className="lg:hidden absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-violet-200/25 rounded-full blur-[70px] pointer-events-none" />

        {/* Form Card wrapper */}
        <div className="w-full max-w-md z-10 transition-all duration-300">
          
          {/* Logo / Header for Mobile / Branding */}
          <div className="text-center mb-8 lg:mb-10">
            <div className="inline-flex lg:hidden items-center justify-center gap-2 mb-3 bg-indigo-50 p-2.5 rounded-2xl border border-indigo-100/50">
              <Shield className="text-indigo-600" size={28} />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                LegalMatch Pro
              </span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              {isSignUp ? "Enter your details to register on the platform" : "Please enter your details to sign in"}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/85 backdrop-blur-md px-6 py-8 sm:p-10 rounded-[2rem] border border-white/60 shadow-xl shadow-slate-100/80">
            {!isSignUp ? (
              /* --- Sign In Form --- */
              <form onSubmit={handleSubmitSignin(onSigninSubmit)} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      {...registerSignin("email")}
                      type="email"
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-800 text-sm font-medium"
                    />
                  </div>
                  {errorsSignin.email?.message && (
                    <p className="text-rose-500 text-xs font-medium pl-1 flex items-center gap-1">
                      <span>●</span> {errorsSignin.email?.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      {...registerSignin("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-800 text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errorsSignin.password?.message && (
                    <p className="text-rose-500 text-xs font-medium pl-1 flex items-center gap-1">
                      <span>●</span> {errorsSignin.password?.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 hover:scale-[1.01] hover:from-indigo-700 hover:to-violet-700 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Sign In
                </button>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                  <p className="text-sm text-slate-500 font-medium">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      onClick={() => setIsSignUp(true)}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold underline underline-offset-4 decoration-indigo-200 hover:decoration-indigo-500 transition-all"
                    >
                      Register here
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              /* --- Sign Up Form --- */
              <form onSubmit={handleSubmitSignup(onSignupSubmit)} className="space-y-4">
                {/* Name Field */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      {...registerSignup("name")}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-800 text-sm font-medium"
                    />
                  </div>
                  {errorsSignup.name?.message && (
                    <p className="text-rose-500 text-xs font-medium pl-1 flex items-center gap-1">
                      <span>●</span> {errorsSignup.name?.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      {...registerSignup("email")}
                      type="email"
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-800 text-sm font-medium"
                    />
                  </div>
                  {errorsSignup.email?.message && (
                    <p className="text-rose-500 text-xs font-medium pl-1 flex items-center gap-1">
                      <span>●</span> {errorsSignup.email?.message}
                    </p>
                  )}
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Lock size={16} />
                      </div>
                      <input
                        {...registerSignup("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-800 text-sm font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errorsSignup.password?.message && (
                      <p className="text-rose-500 text-xs font-medium pl-1 flex items-center gap-1">
                        <span>●</span> {errorsSignup.password?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Lock size={16} />
                      </div>
                      <input
                        {...registerSignup("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-800 text-sm font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errorsSignup.confirmPassword?.message && (
                      <p className="text-rose-500 text-xs font-medium pl-1 flex items-center gap-1">
                        <span>●</span> {errorsSignup.confirmPassword?.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Select Role
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <Shield size={18} />
                    </div>
                    <select
                      {...registerSignup("role")}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none text-slate-800 text-sm font-medium appearance-none cursor-pointer"
                    >
                      <option value="">Select Role</option>
                      <option value="Citizen">Citizen</option>
                      <option value="Lawyer">Lawyer</option>
                      <option value="NGO">NGO</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                  {errorsSignup.role?.message && (
                    <p className="text-rose-500 text-xs font-medium pl-1 flex items-center gap-1">
                      <span>●</span> {errorsSignup.role?.message}
                    </p>
                  )}
                </div>

                {/* Dynamic Lawyer Fields */}
                {selectedRole === "Lawyer" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Specialization */}
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Specialization
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                            <Briefcase size={16} />
                          </div>
                          <select
                            {...registerSignup("specialization")}
                            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none text-slate-800 text-xs font-medium appearance-none cursor-pointer"
                          >
                            <option value="">Select Specialization</option>
                            <option value="Criminal">Criminal</option>
                            <option value="Civil">Civil</option>
                            <option value="Corporate">Corporate</option>
                            <option value="Family">Family</option>
                            <option value="Property">Property</option>
                          </select>
                        </div>
                        {errorsSignup.specialization?.message && (
                          <p className="text-rose-500 text-xs font-medium pl-1 flex items-center gap-1">
                            <span>●</span> {errorsSignup.specialization?.message}
                          </p>
                        )}
                      </div>

                      {/* Location */}
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Location
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                            <MapPin size={16} />
                          </div>
                          <select
                            {...registerSignup("location")}
                            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none text-slate-800 text-xs font-medium appearance-none cursor-pointer"
                          >
                            <option value="">Select Location</option>
                            <option value="Bhopal">Bhopal</option>
                            <option value="Indore">Indore</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        {watchLocation === "Other" && (
                          <input
                            {...registerSignup("location")}
                            placeholder="Enter location"
                            className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-800 text-xs font-medium"
                          />
                        )}
                        {errorsSignup.location?.message && (
                          <p className="text-rose-500 text-xs font-medium pl-1 flex items-center gap-1">
                            <span>●</span> {errorsSignup.location?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* License Number */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        License Number
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                          <Award size={18} />
                        </div>
                        <input
                          {...registerSignup("licenseNumber")}
                          placeholder="BAR/IND/XXXXX/202X"
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-800 text-sm font-medium"
                        />
                      </div>
                      {errorsSignup.licenseNumber?.message && (
                        <p className="text-rose-500 text-xs font-medium pl-1 flex items-center gap-1">
                          <span>●</span> {errorsSignup.licenseNumber?.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Dynamic Admin Field */}
                {selectedRole === "Admin" && (
                  <div className="space-y-1 animate-fadeIn">
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Admin Invite Code
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        {...registerSignup("adminInviteCode")}
                        type={showAdminInviteCode ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-2.5 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-800 text-sm font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminInviteCode((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      >
                        {showAdminInviteCode ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errorsSignup.adminInviteCode?.message && (
                      <p className="text-rose-500 text-xs font-medium pl-1 flex items-center gap-1">
                        <span>●</span> {errorsSignup.adminInviteCode?.message}
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 hover:scale-[1.01] hover:from-indigo-700 hover:to-violet-700 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Sign Up
                </button>

                <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                  <p className="text-sm text-slate-500 font-medium">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      onClick={() => setIsSignUp(false)}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold underline underline-offset-4 decoration-indigo-200 hover:decoration-indigo-500 transition-all"
                    >
                      Sign In here
                    </Link>
                  </p>
                </div>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <Link to="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-indigo-600 text-xs font-semibold transition-colors">
                <ArrowLeft size={14} /> Back to Home
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Signin;
