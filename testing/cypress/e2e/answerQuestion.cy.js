

describe("Answer Question", () => {
    beforeEach(() => {
      cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
      cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  
      cy.visit("http://localhost:3000");
      cy.get("#email").type("general")
      cy.get("#password").type("test")
      cy.get("#signInButton").click()
    })
  
    it("Created new answer should be displayed at the top of the answers page", () => {
      const answers = [
        "Test Answer 1",
        "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
        "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
      ];
      cy.contains("Programmatically navigate using React router").click();
      cy.get("#answerQuestionBtn").click();
      cy.get("#description").type(answers[0]);
      cy.get("#postAnswerBtn").click();
      cy.get(".answerText").each(($el, index) => {
        cy.contains(answers[index]);
      });
      cy.contains("general");
      cy.contains("0 seconds ago");
    });
  
    it("Answer is mandatory when creating a new answer", () => {
      cy.contains("Programmatically navigate using React router").click();
      cy.get("#answerQuestionBtn").click();
      cy.get("#postAnswerBtn").click();
    });
  
    
  
  });