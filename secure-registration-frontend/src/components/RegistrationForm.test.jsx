import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationForm from './RegistrationForm';
import axios from 'axios';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

vi.mock('axios');

const textVariables = {
  inputLabelText: {
    firstName: 'First Name',
    lastName: 'Last Name',
    age: 'Age',
    gender: 'Gender',
    email: 'Email',
    username: 'Username',
    password: 'Password',
  },
  registerFormButtonText: {
    submit: 'Register Account',
  },
  errors: {
    noInput: {
      firstName: 'First name is required',
      lastName: 'Last name is required',
      age: 'Age is required',
      gender: 'Invalid gender selection',
      email: 'Email is required',
      username: 'Username is required',
      password: 'Password is required',
    },
    server: {
      genericMockServerError: 'Try again',
    },
  },
};

// Utility function to fill out the registration form
async function fillOutRegistrationForm(formData) {
  const { firstName, lastName, age, gender, email, username, password } = formData;
  /*
   * We are simulating user keystrokes with userEvent.type and users can only input text (which is treated as strings) into form fields
   * formData.age is sent to API as a number, but typed on the form as a string
   */
  const ageString = age.toString();
  await userEvent.type(screen.getByLabelText(textVariables.inputLabelText.firstName), firstName);
  await userEvent.type(screen.getByLabelText(textVariables.inputLabelText.lastName), lastName);
  await userEvent.type(screen.getByLabelText(textVariables.inputLabelText.age), ageString);
  await userEvent.selectOptions(screen.getByLabelText(textVariables.inputLabelText.gender), gender);
  await userEvent.type(screen.getByLabelText(textVariables.inputLabelText.email), email);
  await userEvent.type(screen.getByLabelText(textVariables.inputLabelText.username), username);
  await userEvent.type(screen.getByLabelText(textVariables.inputLabelText.password), password);
}

describe('RegistrationForm', () => {
  let history;
  let firstNameInput,
    lastNameInput,
    ageInput,
    genderSelect,
    emailInput,
    usernameInput,
    passwordInput,
    submitButton;

  beforeEach(() => {
    history = createMemoryHistory();
    axios.post.mockResolvedValue({ data: { token: 'mocked-token' } });
    render(
      <Router location={history.location} navigator={history}>
        <RegistrationForm />
      </Router>
    );
    firstNameInput = screen.getByLabelText(textVariables.inputLabelText.firstName);
    lastNameInput = screen.getByLabelText(textVariables.inputLabelText.lastName);
    ageInput = screen.getByLabelText(textVariables.inputLabelText.age);
    genderSelect = screen.getByLabelText(textVariables.inputLabelText.gender);
    emailInput = screen.getByLabelText(textVariables.inputLabelText.email);
    usernameInput = screen.getByLabelText(textVariables.inputLabelText.username);
    passwordInput = screen.getByLabelText(textVariables.inputLabelText.password);
    submitButton = screen.getByRole('button', {
      name: textVariables.registerFormButtonText.submit,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('renders form elements correctly', () => {
    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(ageInput).toBeInTheDocument();
    expect(genderSelect).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('shows error messages for invalid inputs', async () => {
    await userEvent.click(submitButton);
    expect(await screen.findByText(textVariables.errors.noInput.firstName)).toBeInTheDocument();
    expect(screen.getByText(textVariables.errors.noInput.lastName)).toBeInTheDocument();
    expect(screen.getByText(textVariables.errors.noInput.age)).toBeInTheDocument();
    expect(screen.getByText(textVariables.errors.noInput.gender)).toBeInTheDocument();
    expect(screen.getByText(textVariables.errors.noInput.email)).toBeInTheDocument();
    expect(screen.getByText(textVariables.errors.noInput.username)).toBeInTheDocument();
    expect(screen.getByText(textVariables.errors.noInput.password)).toBeInTheDocument();
  });

  test('calls registration API on successful submission', async () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      gender: 'male',
      email: 'johndoe@example.com',
      username: 'johndoe',
      password: 'Password123!',
    };
    await fillOutRegistrationForm(formData);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5001/register', formData);
    });
  });

  test('stores token in localStorage and navigates to dashboard on successful registration', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      gender: 'male',
      email: 'johndoe@example.com',
      username: 'johndoe',
      password: 'Password123!',
    };
    await fillOutRegistrationForm(formData);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith('authToken', 'mocked-token');
      expect(history.location.pathname).toBe('/dashboard');
    });
    expect(setItemSpy).toHaveBeenCalledTimes(1);
  });

  test('shows server error message on failed registration', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: textVariables.errors.server.genericMockServerError } },
    });

    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      gender: 'male',
      email: 'johndoe@example.com',
      username: 'johndoe',
      password: 'Password123!',
    };
    await fillOutRegistrationForm(formData);
    await userEvent.click(submitButton);

    expect(
      await screen.findByText(textVariables.errors.server.genericMockServerError)
    ).toBeInTheDocument();
  });
});
