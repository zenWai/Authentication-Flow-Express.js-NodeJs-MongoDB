// generateRandomUser.js
import { faker } from '@faker-js/faker';

faker.seed(123);

function generateRandomUser() {
  const USERNAME_FIXED =
    '7a59f3c8add07cdb20996662c3c7795dc6c203285945a5e1c011bbc082d3a4827ee16a6dd060e71bbb2d089a3f02c4b13174bba15af44b0102ed9650368fe88d';
  const EMAIL_FIXED =
    '7a59f3c8add07cdb20996662c3c7795dc6c203285945a5e1c011bbc082d3a4827ee16a6dd060e71bbb2d089a3f02c4b13174bba15af44b0102ed9650368fe88d@gmail.com';
  const PASSWORD_FIXED = 'MyVerySecurePassword_123';
  const randomUser = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int({ min: 1, max: 120 }),
    gender: 'male',
    EMAIL_FIXED: EMAIL_FIXED,
    USERNAME_FIXED: USERNAME_FIXED,
    PASSWORD_FIXED: PASSWORD_FIXED,
  };

  return randomUser;
}

export default generateRandomUser;
