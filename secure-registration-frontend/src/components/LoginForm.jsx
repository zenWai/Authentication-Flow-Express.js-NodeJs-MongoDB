// LoginForm.jsx
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const loginSchema = yup
  .object()
  .shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  })
  .required();

const LoginForm = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
      usernameInput.focus();
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5001/login', data);
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      console.log('Login successful');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error?.response?.data?.error
        ? `${error.response.data.error}`
        : 'Try again';
      setServerError(errorMessage);
    }
  };

  const clearServerError = useCallback(() => {
    setServerError('');
  }, []);

  return (
    <form
      id="login"
      onSubmit={handleSubmit(onSubmit)}
      onFocus={clearServerError}
      noValidate
      aria-labelledby="login-form-title"
    >
      {/* hidden h2 for screen readers */}
      <h2 id="login-form-title" style={{ visibility: 'hidden' }}>
        Login Form
      </h2>

      {serverError && (
        <div role="alert" aria-live="assertive" style={{ color: 'red' }}>
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="username">
          Username
          <input
            id="username"
            type="text"
            aria-invalid={errors.username ? 'true' : 'false'}
            aria-describedby="username-error"
            autoComplete="username"
            {...register('username')}
          />
        </label>
        {errors.username && (
          <div id="username-error" role="alert" aria-live="assertive" style={{ color: 'red' }}>
            {errors.username.message}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby="password-error"
            autoComplete="current-password"
            {...register('password')}
          />
        </label>
        {errors.password && (
          <div id="password-error" role="alert" aria-live="assertive" style={{ color: 'red' }}>
            {errors.password.message}
          </div>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} aria-disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
};

export default LoginForm;
