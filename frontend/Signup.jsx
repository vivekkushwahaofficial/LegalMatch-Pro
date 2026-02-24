import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
  role: yup.string().oneOf(['Citizen', 'Lawyer', 'NGO', 'Admin'], 'Invalid role').required('Role is required'),
});

function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = data => console.log(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input {...register('name')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input {...register('email')} type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input {...register('password')} type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input {...register('confirmPassword')} type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword?.message}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Role</label>
            <select {...register('role')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Role</option>
              <option value="Citizen">Citizen</option>
              <option value="Lawyer">Lawyer</option>
              <option value="NGO">NGO</option>
              <option value="Admin">Admin</option>
            </select>
            <p className="text-red-500 text-sm mt-1">{errors.role?.message}</p>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;