// userAuthNavigation
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthNavigation = (isValidToken, navigateTo = '/dashboard') => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isValidToken) {
      navigate(navigateTo);
    }
  }, [isValidToken, navigate, navigateTo]);
};

export default useAuthNavigation;
