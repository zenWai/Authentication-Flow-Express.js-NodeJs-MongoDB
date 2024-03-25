// LoginPage.tsx
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm.jsx';
import useAuthNavigation from '../lib/useAuthNavigation.js';
import useTokenValidation from '../lib/useTokenValidation.js';

const LoginPage = () => {
  const { isLoading, isValidToken } = useTokenValidation();
  useAuthNavigation(isValidToken, '/dashboard');
  if (isLoading) return <></>;
  return (
    <section>
      <h1>Welcome</h1>
      <LoginForm />
      <p>
        Don&apos;t have an account? <Link to="/register">Register here</Link>
      </p>
    </section>
  );
};

export default LoginPage;
