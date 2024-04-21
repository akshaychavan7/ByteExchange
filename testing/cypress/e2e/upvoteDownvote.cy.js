
describe("upvote and downvote for questions and answers", () => {
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
  
  
    it("Upvote and downvote for questions", () => {
      // upvote a question
      cy.contains("Quick question about storage on android").click();
      cy.get("#upvoteBtn-question").click();
      cy.get("#voteCount-question").should("contain", "1");
  
      // downvote a question
      cy.get("#downvoteBtn-question").click();
      cy.get("#voteCount-question").should("contain", "-1");
    });
  
  
    it("Upvote and downvote for answers", () => {
      // upvote an answer
      cy.contains("Quick question about storage on android").click();
      cy.get("#upvoteBtn-answer").click();
      cy.get("#voteCount-answer").should("contain", "1");
  
      // downvote an answer
      cy.get("#downvoteBtn-answer").click();
      cy.get("#voteCount-answer").should("contain", "-1");
    });
  
    it("Upvote and downvote for comments", () => {
      cy.contains("Quick question about storage on android").click();
      // click the second one 
      cy.get("#panel1-header-question").click();
  
      cy.get("#upvoteBtn-comment").click();
      cy.get("#voteCount-comment").should("contain", "1");
  
      cy.get("#downvoteBtn-comment").click();
      cy.get("#voteCount-comment").should("contain", "-1");
    });
  });
  