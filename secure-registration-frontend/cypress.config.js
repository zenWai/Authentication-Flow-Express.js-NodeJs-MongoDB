// cypress.config.js
import { defineConfig } from 'cypress';
import cleanupDbTestUser from './cypress/scripts/cleanupDbTestUser.js';
import generateRandomUser from './cypress/scripts/generateRandomUser.js';
import registerDbTestUser from './cypress/scripts/registerDbTestUser.js';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        async cleanupDbTestUser() {
          const randomUser = generateRandomUser();
          const messages = await cleanupDbTestUser(randomUser.EMAIL_FIXED);
          return { messages, cleanedDbUser: randomUser };
        },
      });
      on('task', {
        async registerDbTestUser() {
          const randomUser = generateRandomUser();
          const messages = await registerDbTestUser(randomUser);
          return { messages, registeredDbUser: randomUser };
        },
      });

      return config;
    },
    trashAssetsBeforeRuns: false,
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});

/*on('task', {
        async registerTestUser(userData) {
          try {
            const response = await axios.post('http://localhost:5001/register', userData);

            if (response.status === 201) {
              // Registration successful
              console.log('Test user registered successfully');
              return {
                USERNAME_FIXED: userData.username,
                PASSWORD_FIXED: userData.password,
              };
            } else {
              // Registration failed, throw error
              throw new Error('Registration failed: Unknown error');
            }

          } catch (error) {
            // Test user already registered, ready to log in
            if (error.response && error.response.status === 400) {
              console.log('Test user already registered, ready to log in');
              return {
                USERNAME_FIXED: userData.username,
                PASSWORD_FIXED: userData.password,
              };
            } else if (error.response && error.response.status === 500) {
              throw new Error('Registration failed: Server error');
            } else {
              throw error;
            }
          }
        },
      });*/
