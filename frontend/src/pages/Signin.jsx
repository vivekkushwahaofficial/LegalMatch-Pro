import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
email: yup.string().email("Invalid email").required("Email is required"),
password: yup.string().required("Password is required"),
});

function Signin() {

const { register, handleSubmit, formState: { errors } } = useForm({
resolver: yupResolver(schema),
});

// This function runs when user clicks Sign In
const onSubmit = async (data) => {
try {
const response = await fetch("http://localhost:8080/api/auth/login", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
email: data.email,
password: data.password,
role: "CITIZEN"
})
});


  const result = await response.json();

  // Save tokens in browser
  localStorage.setItem("accessToken", result.accessToken);
  localStorage.setItem("refreshToken", result.refreshToken);

  alert("Login successful!");

  // redirect after login
  window.location.href = "/dashboard";

} catch (error) {
  console.error("Login error:", error);
  alert("Login failed");
}


};

return ( <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4"> <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"> <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>


    <form onSubmit={handleSubmit(onSubmit)}>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Email</label>

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
        <label className="block text-gray-700 mb-2">Password</label>

        <input
          {...register("password")}
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />

        <p className="text-red-500 text-sm mt-1">
          {errors.password?.message}
        </p>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg"
      >
        Sign In
      </button>

    </form>
  </div>
</div>


);
}

export default Signin;
