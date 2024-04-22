
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

    it("access home page without signing in should show unauthorized access and click on log in button to direct back to login page", () => {
        cy.visit("http://localhost:3000/home");
        cy.contains("Unauthorized Access");
        cy.get("#signInLink").click();
        cy.get("#email").type("general")
        cy.get("#password").type("test")
        cy.get("#signInButton").click()
    
        cy.contains('Trending Questions');
    });

    it("if user is already logged in then redirect to home page", () => {
        cy.visit("http://localhost:3000/login");
        cy.get("#email").type("general")
        cy.get("#password").type("test")
        cy.get("#signInButton").click()
        
        // sleep for 1 seconds
        cy.wait(500);
        cy.visit("http://localhost:3000/login");
        cy.contains('Trending Questions');
    });
  });