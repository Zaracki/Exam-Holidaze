import PrimaryButton from '../../components/buttons/PrimaryButton';
import InputField from '../../components/inputs/InputField';

const LoginForm = ({ email, password, formError, loading, error, handleSubmit, setEmail, setPassword }) => {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InputField
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        label="Email"
      />
      <InputField
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        label="Password"
      />
      {formError && (
        <p className="text-red-400 text-sm mt-1">{formError}</p>
      )}
      <div>
        <PrimaryButton className="w-full" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </PrimaryButton>
      </div>
      {error && <p className="text-red-400">{error.message}</p>}
    </form>
  );
};

export default LoginForm;