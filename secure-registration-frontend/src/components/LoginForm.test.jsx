import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import LoginForm from './LoginForm';
import axios from 'axios';

vi.mock('axios');

const textVariables = {
  inputLabelText: {
    username: 'Username',
    password: 'Password',
  },
  loginFormButtonText: {
    submit: 'Log in',
  },
  errors: {
    noInput: {
      username: 'Username is required',
      password: 'Password is required',
    },
    server: {
      genericMockedServerError: 'Try again later',
    },
  },
};

describe('LoginForm', () => {
  let history;
  let usernameInput, passwordInput, submitButton;

  beforeEach(() => {
    history = createMemoryHistory();
    axios.post.mockResolvedValue({ data: { token: 'mocked-token' } });
    render(
      <Router location={history.location} navigator={history}>
        <LoginForm />
      </Router>
    );
    usernameInput = screen.getByLabelText(textVariables.inputLabelText.username);
    passwordInput = screen.getByLabelText(textVariables.inputLabelText.password);
    submitButton = screen.getByRole('button', {
      name: textVariables.loginFormButtonText.submit,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('renders form elements correctly', () => {
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('shows error messages for invalid inputs', async () => {
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(textVariables.errors.noInput.username)).toBeInTheDocument();
      expect(screen.getByText(textVariables.errors.noInput.password)).toBeInTheDocument();
    });
  });

  test('calls login API on successful submission', async () => {
    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'testpassword');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5001/login', {
        username: 'testuser',
        password: 'testpassword',
      });
    });
  });

  test('stores token in localStorage and navigates to dashboard on successful login', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'testpassword');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith('authToken', 'mocked-token');
      expect(history.location.pathname).toBe('/dashboard');
    });
    expect(setItemSpy).toHaveBeenCalledTimes(1);
  });

  test('shows server error message on failed login', async () => {
    await axios.post.mockRejectedValueOnce({
      response: {
        data: { error: textVariables.errors.server.genericMockedServerError },
        status: 400,
        statusText: 'Bad Request',
      },
    });
    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'testpassword');
    await userEvent.click(submitButton);

    // Wait for the serverError state to be updated
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        textVariables.errors.server.genericMockedServerError
      );
    });
  });
});
