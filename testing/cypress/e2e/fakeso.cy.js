
describe("Sign In", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
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


describe("Sign Up", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
  });

  it('Sign up as a general user should be succesful and lead back to sign in page', () => {
    cy.visit("http://localhost:3000");
    cy.get("#signUpLink").click()
    cy.get("#firstName").type("firstName")
    cy.get("#lastName").type("lastName")
    cy.get("#email").type("newUser@gmail.com")
    cy.get("#password").type("test")

    cy.get('input[id=":r4:"]').type('New York, NY');


    cy.get("#signUpButton").click()

    cy.contains('User registered successfully');
    cy.contains('Sign In');
  })

  it('Sign up with missing fields should show an error', () => {
    cy.visit("http://localhost:3000");
    cy.get("#signUpLink").click()
    cy.get("#signUpButton").click()

    cy.contains('Make sure you fill all the required fields!');
    
    cy.get("#firstName").type("firstName")
    cy.get("#signUpButton").click()
    
    cy.contains('Make sure you fill all the required fields!');

    cy.get("#lastName").type("lastName")
    cy.get("#signUpButton").click()

    cy.contains('Make sure you fill all the required fields!');

    cy.get("#email").type("test@gmail.com")
    cy.get("#signUpButton").click()

    cy.contains('Make sure you fill all the required fields!');

    cy.get("#password").type("test")
    cy.get("#signUpButton").click()

    cy.contains('Make sure you fill all the required fields!');
  });

});