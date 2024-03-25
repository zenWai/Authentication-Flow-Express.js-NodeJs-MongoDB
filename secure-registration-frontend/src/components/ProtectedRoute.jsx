// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useTokenValidation from '../lib/useTokenValidation.js';

const ProtectedRoute = ({ children }) => {
  const { isLoading, isValidToken } = useTokenValidation();

  if (isLoading) {
    return <></>;
  }

  if (!isValidToken) {
    // the replace prop ensures that the redirect doesn't create a new entry in the history stack
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
