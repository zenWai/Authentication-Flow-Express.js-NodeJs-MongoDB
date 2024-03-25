// RegistrationForm.jsx
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const registrationSchema = yup
  .object()
  .shape({
    firstName: yup.string().trim().required('First name is required'),
    lastName: yup.string().trim().required('Last name is required'),
    age: yup
      .number()
      // we transform to fix the strange error of yup.number() that throws
      // age must be a `number` type, but the final value was: `NaN` (cast from the value `""`).
      // this way skips to the .required() validation
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? undefined : value
      )
      .required('Age is required')
      .positive('Age must be greater than zero')
      .integer('Age must be an number')
      .max(120, 'Age must be less than 120'),
    gender: yup
      .string()
      .oneOf(['male', 'female', 'other'], 'Invalid gender selection')
      .required('Gender is required'),
    email: yup
      .string()
      .trim()
      .email('Invalid email address')
      .required('Email is required')
      .matches(/^[\S]+$/, 'Email cannot contain spaces'),
    username: yup
      .string()
      .trim()
      .required('Username is required')
      .min(4, 'Username must be at least 4 characters long')
      .matches(/^[\S]+$/, 'Username cannot contain spaces'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_.+-])[^\s]+$/,
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, one special character, and cannot contain spaces'
      ),
  })
  .required();

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registrationSchema),
  });

  useEffect(() => {
    const firstNameInput = document.getElementById('firstName');
    if (firstNameInput) {
      firstNameInput.focus();
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5001/register', data);
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      console.log('User registered successfully');
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
      id="register"
      onSubmit={handleSubmit(onSubmit)}
      onFocus={clearServerError}
      noValidate
      aria-labelledby="registration-form-title"
    >
      {/* hidden h2 for screen readers */}
      <h2 id="registration-form-title" style={{ visibility: 'hidden' }}>
        Registration Form
      </h2>

      {serverError && (
        <div role="alert" aria-live="assertive" style={{ color: 'red' }}>
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="firstName">
          First Name
          <input
            id="firstName"
            aria-invalid={errors.firstName ? 'true' : 'false'}
            aria-describedby="firstName-error"
            autoComplete="cc-name"
            {...register('firstName')}
          />
        </label>
        {errors.firstName && (
          <div id="firstName-error" role="alert" aria-live="assertive" className="error">
            {errors.firstName.message}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="lastName">
          Last Name
          <input
            id="lastName"
            aria-invalid={errors.lastName ? 'true' : 'false'}
            aria-describedby="lastName-error"
            autoComplete="cc-family-name"
            {...register('lastName')}
          />
        </label>
        {errors.lastName && (
          <div id="lastName-error" role="alert" aria-live="assertive" className="error">
            {errors.lastName.message}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="age">
          Age
          <input
            id="age"
            type="number"
            aria-invalid={errors.age ? 'true' : 'false'}
            aria-describedby="age-error"
            {...register('age')}
          />
        </label>
        {errors.age && (
          <div id="age-error" role="alert" aria-live="assertive" className="error">
            {errors.age.message}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="gender">
          Gender
          <select
            id="gender"
            aria-invalid={errors.gender ? 'true' : 'false'}
            aria-describedby="gender-error"
            {...register('gender')}
          >
            <option value="" aria-label="Selection of gender options">
              Select gender
            </option>
            <option value="male" aria-label="Male">
              Male
            </option>
            <option value="female" aria-label="Female">
              Female
            </option>
            <option value="other" aria-label="Other">
              Other
            </option>
          </select>
        </label>
        {errors.gender && (
          <div id="gender-error" role="alert" aria-live="assertive" className="error">
            {errors.gender.message}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby="email-error"
            autoComplete="email"
            {...register('email')}
          />
        </label>
        {errors.email && (
          <div id="email-error" role="alert" aria-live="assertive" className="error">
            {errors.email.message}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="username">
          Username
          <input
            id="username"
            aria-invalid={errors.username ? 'true' : 'false'}
            aria-describedby="username-error"
            autoComplete="username"
            {...register('username')}
          />
        </label>
        {errors.username && (
          <div id="username-error" role="alert" aria-live="assertive" className="error">
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
            autoComplete="new-password"
            {...register('password')}
          />
        </label>
        {errors.password && (
          <div id="password-error" role="alert" aria-live="assertive" className="error">
            {errors.password.message}
          </div>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} aria-disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register Account'}
      </button>
    </form>
  );
};

export default RegistrationForm;
