let registeredUser = {};
describe('Login', () => {
  before(() => {
    cy.task('registerDbTestUser').then(({ registeredDbUser }) => {
      registeredUser = registeredDbUser;
    });
  });

  beforeEach(() => {
    cy.visit('http://localhost:5173/');
    cy.get('input#username').type(registeredUser.USERNAME_FIXED);
    cy.get('input#password').type(registeredUser.PASSWORD_FIXED);
    cy.get('form').submit();
    cy.window().should((window) => {
      const token = window.localStorage.getItem('authToken');
      expect(token).to.not.be.empty;
    });
  });

  it('should redirect to the dashboard if the user is already logged in', () => {
    cy.visit('http://localhost:5173/');
    cy.url().should('include', '/dashboard');
    cy.visit('http://localhost:5173/register');
    cy.url().should('include', '/dashboard');
  });

  it('Removing token and should be able to visit login and register', () => {
    cy.visit('http://localhost:5173/dashboard');
    cy.url().should('include', '/dashboard');
    {
      /* Simulate a logout */
    }
    cy.window().should((window) => {
      window.localStorage.removeItem('authToken');
      expect(window.localStorage.getItem('authToken')).to.be.null;
    });

    cy.visit('http://localhost:5173/');
    cy.url().should('equal', 'http://localhost:5173/');
    cy.visit('http://localhost:5173/register');
    cy.url().should('equal', 'http://localhost:5173/register');
  });

  it('Manipulate Token does not allow to visit dashboard', () => {
    {
      /* Manipulate while maintaining same length */
    }
    cy.window().should((window) => {
      const originalToken = window.localStorage.getItem('authToken');
      window.localStorage.setItem('authToken', 'a' + originalToken.slice(1));
      const manipulatedToken = window.localStorage.getItem('authToken');
      expect(manipulatedToken.length).to.eq(originalToken.length);
    });

    cy.visit('http://localhost:5173/dashboard');
    cy.url().should('not.include', '/dashboard');
    cy.visit('http://localhost:5173/');
    cy.url().should('equal', 'http://localhost:5173/');
    cy.visit('http://localhost:5173/register');
    cy.url().should('equal', 'http://localhost:5173/register');
  });
});
