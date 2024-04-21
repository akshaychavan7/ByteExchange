


describe("test Moderator", () => {
    before(() => {
      // Seed the database before each test
      cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
      cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
    });
  
    beforeEach(() => {
      cy.visit("http://localhost:3000");
      cy.get("#email").type("moderator")
      cy.get("#password").type("test")
      cy.get("#signInButton").click()
    });
  
  
    it("moderator can delete question", () => {
      cy.contains("the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.")
      cy.get("#deleteBtn").click();
  
      cy.get('#root').should('not.contain', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.');
  
      cy.get(".header-avatar").click();
  
      cy.get("#signOutBtn").click();
      cy.get("#email").type("general");
      cy.get("#password").type("test");
      cy.get("#signInButton").click();
  
      cy.get("#root").should('not.contain', 'Programmatically navigate using React router');
    });
  
    it("moderator can delete answer", () => {
      cy.get('#answersBtn').click();
      cy.contains("YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);")
      cy.get("#deleteBtn").click();
      cy.get('#root').should('not.contain', 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);');
      
      cy.get(".header-avatar").click();
  
      cy.get("#signOutBtn").click();
      cy.get("#email").type("general")
      cy.get("#password").type("test")
      cy.get("#signInButton").click()
  
      cy.contains("android studio save string shared preference, start activity and load the saved string").click()
  
      cy.get("#answers-section").should('not.contain', 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);');
    });
  
    it("moderator can delete comment", () => {
      cy.get('#commentsBtn').click();
      cy.contains("This is so helpful")
      cy.get("#deleteBtn").click();
  
      cy.get('#root').should('not.contain', 'This is so helpful');
  
      cy.get(".header-avatar").click();
  
      cy.get("#signOutBtn").click();
      cy.get("#email").type("general")
      cy.get("#password").type("test")
      cy.get("#signInButton").click()
  
      cy.contains("Object storage for a web application").click()
      
      cy.get("#panel1-header-question").click();
  
      cy.get("#root").should('not.contain', 'This is so helpful');
    });
  
  });
  