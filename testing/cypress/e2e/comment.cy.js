
describe("Add comment", () => {

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


    it("Add a comment to a question", () => {
      cy.contains("Quick question about storage on android").click();
      cy.get("#panel1-header-question").click();
      cy.get("#comment-input-question").type("This is a comment");
      cy.get("#postCommentBtn-question").click();
      cy.contains("This is a comment");
    });

    it("Add a comment to an answer", () => {
      cy.contains("Quick question about storage on android").click();
      cy.get('#panel1-header-answer').click();
      cy.get("#comment-input-answer").type("This is a comment");
      cy.get("#postCommentBtn-answer").click();
      cy.contains("This is a comment");
    });

    it("Add an empty comment should show an error", () => {
      cy.contains("Quick question about storage on android").click();
      cy.get('#panel1-header-answer').click();
      cy.get("#postCommentBtn-answer").click();
      cy.contains("Failed to post comment");
    });
});
