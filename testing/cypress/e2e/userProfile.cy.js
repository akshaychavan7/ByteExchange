
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
    
    it("click user profile icon should display user page", () => {
        cy.get("#profilePic").click();
        cy.contains("Akshay");
        cy.contains("Boston, MA")
        cy.contains("Questions")
        cy.contains("Answers")
        cy.contains("JavaScript")
        cy.contains("React")
        cy.contains("TypeScript")

        cy.get("#closeProfile").click()

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
    });
  
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

    it("User with no questions and answers should display no questions and answers", () => {
        cy.get("#sideBarUsers").click();
        cy.contains("Jane Doe").click();
        cy.contains("No questions posted yet");
        cy.contains("No answers posted yet");
    });

    it("Search for user should display user info", () => {
      cy.get("#sideBarUsers").click();
      cy.get('#search').type('Shawn')
      cy.contains("Shiu Chen");
    })

    it("Search for invalid user should display no user found", () => {
        cy.get("#sideBarUsers").click();
        cy.get('#search').type('invalid')
        cy.contains("User not found");
    });
  })
  
  