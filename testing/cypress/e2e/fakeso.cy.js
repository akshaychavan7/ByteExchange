
describe("Cypress Tests repeated from React assignment", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");

    cy.visit("http://localhost:3000");
    cy.get("#email").type("general")
    cy.get("#password").type("test")
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
  });

  it('1.1 | ', () => {
    pass
  })
});
