// registration.cy.js
let cleanedUser = {};
describe('Registration', () => {
  before(() => {
    cy.task('cleanupDbTestUser').then(({ messages, cleanedDbUser }) => {
      expect(messages).to.include('Connected to MongoDB');
      expect(messages.some((message) => message.startsWith('Deleted'))).to.be.true;
      expect(messages.some((message) => message.startsWith('Disconnected'))).to.be.true;
      expect(messages.some((message) => message.includes('Error'))).to.be.false;
      cleanedUser = cleanedDbUser;
    });
  });

  beforeEach(() => {
    cy.visit('localhost:5173/register');

    cy.get('input#firstName').type(cleanedUser.firstName);
    cy.get('input#lastName').type(cleanedUser.lastName);
    cy.get('input#age').type(cleanedUser.age);
    cy.get('select#gender').select(cleanedUser.gender);
    cy.get('input#email').type(cleanedUser.EMAIL_FIXED);
    cy.get('input#username').type(cleanedUser.USERNAME_FIXED);
    cy.get('input#password').type(cleanedUser.PASSWORD_FIXED);
    cy.get('form').submit();
  });

  it('should register a new user, redirect to dashboard and store token in local storage', () => {
    // Assert that the user is registered successfully
    cy.url().should('include', '/dashboard');
    cy.window().should((window) => {
      const token = window.localStorage.getItem('authToken');
      expect(token).not.to.be.empty;
      expect(token).to.be.a('string');
    });
  });

  it('registering with already registered email should not register', () => {
    // Assert that the user is already registered
    cy.get('div[role="alert"]').contains('Email or username already exists').should('be.visible');
  });
});
