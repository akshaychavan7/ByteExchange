
describe("User page", () => {
    before(() => {
      // Seed the database before each test
      cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
      cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
    });
  
    beforeEach(() => {
      cy.visit("http://localhost:3000");
      cy.get("#email").type("general")
      cy.get("#password").type("test")
      cy.get("#signInButton").click()
    });
  
    it("should display user page", () => {
      const nameList = [
        "Akshay",
        "John",
        "Shiu",
        "Vedant Rishi",
        "Sameer",
        "Sudhanva"
      ]
      cy.get("#sideBarUsers").click();
      nameList.forEach((name) => {
        cy.contains(name);
      });
    })
  
    it("Click on name should display user info", () => {
      cy.get("#sideBarUsers").click();
      cy.contains("Akshay").click();
      cy.contains("Akshay");
      cy.contains("Boston, MA")
      cy.contains("Questions")
      cy.contains("Answers")
      cy.contains("JavaScript")
      cy.contains("React")
      cy.contains("TypeScript")
    })
  })
  
  