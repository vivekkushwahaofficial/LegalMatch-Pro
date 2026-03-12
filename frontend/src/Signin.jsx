import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

function Signin() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = data => console.log(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 mb-4">Sign In</button>
          <div className="text-center mb-4 text-gray-600">or</div>
          <button type="button" className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 mb-2">Sign in with Google</button>
          <button type="button" className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition duration-200">Sign in with GitHub</button>
        </form>
      </div>
    </div>
  );
}

export default Signin;