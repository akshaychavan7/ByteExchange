
describe("Search Question", () => {
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
    })
  
    it("Search for a question using text content that does not exist", () => {
      cy.get("#searchBar").type("test").type("{enter}");
      cy.contains('No questions found');
      cy.get(".postTitle").should("have.length", 0);
    });
  
    it("Search string in question text", () => {
      const qTitles = ["Object storage for a web application"];
      cy.visit("http://localhost:3000");
      cy.get("#searchBar").type("40 million{enter}");
      cy.get(".postTitle").each(($el, index, $list) => {
        cy.wrap($el).should("contain", qTitles[index]);
      });
    });
  
  
    it("Search string in question text", () => {
      const qTitles = ["Quick question about storage on android"];
      cy.get("#searchBar").type("data remains{enter}");
      cy.get(".postTitle").each(($el, index, $list) => {
        cy.wrap($el).should("contain", qTitles[index]);
      });
    });
  
    it("Search a question by tag (t1)", () => {
      const qTitles = ["Programmatically navigate using React router"];
      
      cy.get("#searchBar").type("[react]{enter}");
      cy.get(".postTitle").each(($el, index, $list) => {
        cy.wrap($el).should("contain", qTitles[index]);
      });
    });
  
    it("Search a question by tag (t2)", () => {
      const qTitles = [
        "android studio save string shared preference, start activity and load the saved string",
        "Programmatically navigate using React router",
      ];
  
      cy.get("#searchBar").type("[javascript]{enter}");
      cy.get(".postTitle").each(($el, index, $list) => {
        cy.wrap($el).should("contain", qTitles[index]);
      });
    });
  
    it("Search a question by tag (t3)", () => {
      const qTitles = [
        "Quick question about storage on android",
        "android studio save string shared preference, start activity and load the saved string",
      ];
  
      cy.get("#searchBar").type("[android-studio]{enter}");
      cy.get(".postTitle").each(($el, index, $list) => {
        cy.wrap($el).should("contain", qTitles[index]);
      });
    });
  
    it("Search a question by tag (t4)", () => {
      const qTitles = [
        "Quick question about storage on android",
        "android studio save string shared preference, start activity and load the saved string",
      ];
      cy.get("#searchBar").type("[shared-preferences]{enter}");
      cy.get(".postTitle").each(($el, index, $list) => {
        cy.wrap($el).should("contain", qTitles[index]);
      });
    });
  
    it("Search for a question using a tag that does not exist", () => {
      cy.get("#searchBar").type("[nonExistentTag]{enter}");
      cy.get(".postTitle").should("have.length", 0);
    });
  });
  
  