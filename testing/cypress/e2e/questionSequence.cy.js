
describe("Verifies Question Answer sequence", () => {

    beforeEach(() => {
      // Seed the database before each test
      cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
      cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
    });
  
    beforeEach(() => {
      cy.visit("http://localhost:3000");
      cy.get("#email").type("general")
      cy.get("#password").type("test")
      cy.get("#signInButton").click()
    })
  
    it("Adds a question, click active button, verifies the sequence", () => {
      // add a question
      cy.get("#askQuestionButton").click()
      cy.get("#title").type("Test Question A")
      cy.get("#description").type("Test Question A Description")
      cy.get("#tags").type("tag1").type("{enter}")
      cy.get("#postQuestionButton").click()
      
      // add an answer to question of React Router
      cy.contains("Programmatically navigate using React router").click();
      cy.get("#answerQuestionBtn").click();
      cy.get("#description").type("Test Answer A");
      cy.get("#postAnswerBtn").click();
  
      // go back to main page
      cy.get("#sideBarQuestions").click();
  
      // add an answer to question of Android Studio
      cy.contains("android studio save string shared preference, start activity and load the saved string").click();
      cy.get("#answerQuestionBtn").click();
      cy.get("#description").type("Test Answer B");
      cy.get("#postAnswerBtn").click();
  
      // go back to main page
      cy.get("#sideBarQuestions").click();
  
      // add an answer to question A
      cy.contains("Test Question A").click();
      cy.get("#answerQuestionBtn").click();
      cy.get("#description").type("Test Answer C");
      cy.get("#postAnswerBtn").click();
  
      // go back to main page
      cy.get("#sideBarQuestions").click();
  
      // clicks active
      cy.get("#active").click();
  
      const qTitles = [
        "Test Question A",
        "android studio save string shared preference, start activity and load the saved string",
        "Programmatically navigate using React router",
        "Quick question about storage on android",
        "Object storage for a web application",
      ];
      cy.get(".postTitle").each(($el, index, $list) => {
        cy.wrap($el).should("contain", qTitles[index]);
      });
    
    });

    it("click unanswered button, verifies the sequence", () => {

        cy.get("#askQuestionButton").click()
        cy.get("#title").type("Test Question A")
        cy.get("#description").type("Test Question A Description")
        cy.get("#tags").type("tag1").type("{enter}")
        cy.get("#postQuestionButton").click()

        cy.get("#unanswered").click();
    
        const qTitles = [
            "Test Question A"
        ];

        cy.get(".postTitle").each(($el, index, $list) => {
            cy.wrap($el).should("contain", qTitles[index]);
        });
    });
    
    it("click trending button, verifies the sequence", () => {     
        cy.get("#sideBarHome").click();
        cy.get("#active").click();
        cy.get("#newest").click();
    
        const qTitles = [
            "Object storage for a web application",
            "Quick question about storage on android",
            "android studio save string shared preference, start activity and load the saved string",
            "Programmatically navigate using React router",
          ];
          cy.get(".postTitle").each(($el, index, $list) => {
            cy.wrap($el).should("contain", qTitles[index]);
          });
    });

    it("click active button, verifies the sequence", () => {
        cy.get("#sideBarHome").click();
        cy.get("#active").click();
    
        const qTitles = [
            "Quick question about storage on android",
            "Object storage for a web application",
            "android studio save string shared preference, start activity and load the saved string",
            "Programmatically navigate using React router",
          ];
          cy.get(".postTitle").each(($el, index, $list) => {
            cy.wrap($el).should("contain", qTitles[index]);
          });
    });

    it("click unanswered button, verifies the sequence", () => {
        cy.get("#sideBarHome").click();
        cy.get("#unanswered").click();
    
        cy.contains("No questions found");
    });



    it("Checks if a6 and a7 exist in q3 answers page", () => {
      const answers = [
        "Using GridFS to chunk and store content.",
        "Storing content as BLOBs in databases.",
      ];
      cy.contains("Object storage for a web application").click();
      cy.get(".answerText").each(($el, index) => {
        cy.contains(answers[index]);
      });
    });
  
    it("Checks if a8 exist in q4 answers page", () => {
      cy.contains("Quick question about storage on android").click();
      cy.contains("Store data in a SQLLite database.");
    });
  
  });
  