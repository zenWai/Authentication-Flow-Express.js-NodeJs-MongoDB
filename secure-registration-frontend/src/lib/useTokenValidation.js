// useTokenValidation.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useTokenValidation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        setIsValidToken(false);
        return;
      }

      axios
        .get('http://localhost:5001/validate-token', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setIsValidToken(true);
        })
        .catch((error) => {
          console.error('Validation error:', error);
          setIsValidToken(false);
          localStorage.removeItem('authToken'); // Remove the invalid token
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    validateToken();
  }, []);

  return { isLoading, isValidToken };
};

export default useTokenValidation;
