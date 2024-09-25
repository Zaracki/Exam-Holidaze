import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePost from '../../hooks/usePost';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { API_URL_REGISTER } from '../../api/Constants';

const Register = () => {
  const navigate = useNavigate();
  const { post, loading, error: apiError } = usePost(`${API_URL_REGISTER}`);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: {
      url: '',
    },
    venueManager: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const errors = {};
    if (!/^[a-zA-Z0-9_]+$/.test(formData.name)) {
      errors.name = 'Name can only contain letters, numbers, and underscores.';
    }
    if (!/^.+@stud\.noroff\.no$/.test(formData.email)) {
      errors.email = 'Email must be a valid stud.noroff.no address.';
    }
    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }
    if (formData.avatar.url && !/^https?:\/\/[^\s]+$/.test(formData.avatar.url)) {
      errors.avatarUrl = 'Avatar URL must be a valid and accessible URL.';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const result = await post(formData);

    if (result && result.errors) {
      const apiValidationErrors = {};
      result.errors.forEach((error) => {
        if (error.path && error.path.includes('avatar') && error.path.includes('url')) {
          apiValidationErrors.avatarUrl = 'Avatar URL must be a valid and accessible URL.';
        } else if (error.message.includes('Profile already exists')) {
          apiValidationErrors.name = 'Username or email is already taken.';
          apiValidationErrors.email = 'Username or email is already taken.';
        } else if (error.message.includes('name')) {
          apiValidationErrors.name = 'Username is already taken.';
        } else if (error.message.includes('email')) {
          apiValidationErrors.email = 'Email is already taken.';
        }
      });
      setFormErrors(apiValidationErrors);
    } else {
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 500);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-stone-800 text-white">
        <h1 className="text-2xl font-bold text-center">Register</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="avatarUrl">
              Avatar URL
            </label>
            <input
              type="text"
              id="avatarUrl"
              name="avatar.url"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="Enter avatar URL"
              value={formData.avatar.url}
              onChange={handleChange}
            />
            {formErrors.avatarUrl && <p className="text-red-500 text-xs mt-1">{formErrors.avatarUrl}</p>}
          </div>
          <div className="flex items-center">
            <input
              id="venueManager"
              name="venueManager"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              checked={formData.venueManager}
              onChange={handleChange}
            />
            <label htmlFor="venueManager" className="ml-2 block text-sm">
              I want to be a venue manager
            </label>
          </div>
          <div>
            <PrimaryButton className="w-full" type="submit" disabled={loading}>
              Register
            </PrimaryButton>
          </div>
        </form>
        {apiError && <p className="text-red-500 text-center">{apiError.message}</p>}
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
        <p className="text-center text-sm text-gray-300">
          Already registered?{' '}
          <a href="/login" className="text-white hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
