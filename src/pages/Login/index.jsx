import React, { useState } from 'react';
import usePost from '../../hooks/usePost';
import { save } from '../../utils/LocalStorage';
import PrimaryButton from '../../components/buttons/PrimaryButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { post, loading, error } = usePost('https://v2.api.noroff.dev/auth/login');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { email, password };
    const result = await post(data);
    if (result && result.data) {
      save('userProfile', result.data);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <PrimaryButton className="w-full" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </PrimaryButton>
          </div>
        </form>
        {error && <p className="text-red-500">{error.message}</p>}
        <p className="text-center text-sm text-gray-600">
          Not registered?{' '}
          <a href="/register" className="text-indigo-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;