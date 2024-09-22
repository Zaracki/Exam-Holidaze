import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePost from '../../hooks/usePost';
import { save } from '../../utils/LocalStorage';
import LoginForm from '../../components/form/LoginForm';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const { post, loading, error } = usePost('https://v2.api.noroff.dev/auth/login');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setLoginSuccess('');

    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address.');
      return;
    };

    const data = { email, password };

    try {
      const result = await post(data);
      if (result && result.data) {
        save('userProfile', result.data);
        save('accessToken', result.data.accessToken);
        setLoginSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 500); // Redirect after 0.5 seconds
      } else if (result && result.errors && result.errors.length > 0) {
        setFormError(result.errors[0].message);
      } else {
        setFormError('An error occurred. Please try again.');
      }
    } catch (err) {
      setFormError('Network error. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
        <LoginForm
          email={email}
          password={password}
          formError={formError}
          loading={loading}
          error={error}
          handleSubmit={handleSubmit}
          setEmail={setEmail}
          setPassword={setPassword}
        />
        {loginSuccess && (
          <p className="text-green-500 text-sm mt-1">{loginSuccess}</p>
        )}
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