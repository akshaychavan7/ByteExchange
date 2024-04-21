


describe("report question, answer, comment", () => {
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
  
    it("report question", () => {
      cy.contains("Quick question about storage on android").click();
      cy.get("#reportBtn-question").click();
      cy.contains("Post has been flagged for review");
  
      cy.get("#sideBarLogout").click()
      cy.get("#email").type("moderator")
      cy.get("#password").type("test")
      cy.get("#signInButton").click()
  
      cy.contains("I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains")
    });
  
    it("report answer", () => {
      cy.contains("Quick question about storage on android").click();
      cy.get("#panel1-header-answer").click();
      cy.get("#reportBtn-answer").click();
      cy.contains("Post has been flagged for review");
      
      cy.get("#sideBarLogout").click()
      cy.get("#email").type("moderator")
      cy.get("#password").type("test")
      cy.get("#signInButton").click()
  
      cy.get("#answersBtn").click();
  
      cy.contains("Store data in a SQLLite database.");    
    });
  
    it("report comment", () => {
      cy.contains("Quick question about storage on android").click();
      cy.get("#panel1-header-question").click();
      cy.get("#reportBtn-comment").click();
      cy.contains("Post has been flagged for review");
  
      cy.get("#sideBarLogout").click()
      cy.get("#email").type("moderator")
      cy.get("#password").type("test")
      cy.get("#signInButton").click()
  
      cy.get("#commentsBtn").click();
  
      cy.contains("This is great")
    });
  })