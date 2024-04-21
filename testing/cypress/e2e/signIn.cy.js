
describe("Sign In", () => {
    before(() => {
      // Seed the database before each test
      cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
    });
  
    after(() => {
      // Clear the database after each test
      cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    });
  
    it('Sign in as a general user should lead to home page', () => {
      cy.visit("http://localhost:3000");
      cy.get("#email").type("general")
      cy.get("#password").type("test")
      cy.get("#signInButton").click()
  
      cy.contains('Trending Questions');
    })
  
    it('Sign in as a moderator should lead to home page', () => {
      cy.visit("http://localhost:3000");
      cy.get("#email").type("moderator")
      cy.get("#password").type("test")
      cy.get("#signInButton").click()
      
      cy.contains('reported questions');
    })
  
    it('Sign in with invalid credentials should show an error', () => {
      cy.visit("http://localhost:3000");
      cy.get("#email").type("invalid")
      cy.get("#password").type("invalid")
      cy.get("#signInButton").click()
      
      cy.contains('Invalid credentials');
    });
  });