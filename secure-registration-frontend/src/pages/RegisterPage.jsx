// RegisterPage.jsx
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm.jsx';
import useAuthNavigation from '../lib/useAuthNavigation.js';
import useTokenValidation from '../lib/useTokenValidation.js';

const RegisterPage = () => {
  const { isLoading, isValidToken } = useTokenValidation();
  useAuthNavigation(isValidToken, '/dashboard');
  if (isLoading) return <></>;
  return (
    <section>
      <h1>Welcome</h1>
      <RegistrationForm />
      <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </section>
  );
};

export default RegisterPage;
