
describe("Tags", () => {

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

    it("Adds a question with tags, checks the tags existied", () => {
    cy.get("#askQuestionButton").click()
    cy.get("#title").type("Test Question A")
    cy.get("#description").type("Test Question A Description")
    cy.get("#tags").type("test1").type("{enter}")
    cy.get("#tags").type("test2").type("{enter}")
    cy.get("#tags").type("test3").type("{enter}")
    cy.get("#postQuestionButton").click()

    // clicks tags
    cy.get("#sideBarTags").click();
    cy.contains("test1");
    cy.contains("test2");
    cy.contains("test3");
    });

    it("Checks if all tags exist", () => {
    cy.get("#sideBarTags").click();
    cy.contains("react", { matchCase: false });
    cy.contains("javascript", { matchCase: false });
    cy.contains("android-studio", { matchCase: false });
    cy.contains("shared-preferences", { matchCase: false });
    cy.contains("storage", { matchCase: false });
    cy.contains("website", { matchCase: false });
    });

    it("Checks if all questions exist inside tags", () => {
    cy.get("#sideBarTags").click();
    cy.contains("6 Tags");
    cy.contains("1 question");
    cy.contains("2 question");
    });

    it("go to question in tag react", () => {
        // all question no. should be in the page
        cy.get("#sideBarTags").click()
        cy.contains("react").click();
        cy.contains("Programmatically navigate using React router");
    });
    
    it("go to questions in tag storage", () => {
        // all question no. should be in the page
        cy.get("#sideBarTags").click()
        cy.contains("storage").click();
        cy.contains("Quick question about storage on android");
        cy.contains("Object storage for a web application");
    });
    
    it("create a new question with a new tag and finds the question through tag", () => {
    
        // add a question with tags
        cy.get("#askQuestionButton").click()
        cy.get("#title").type("Test Question A")
        cy.get("#description").type("Test Question A Description")
        cy.get("#tags").type("test1-tag1").type("{enter}")
        cy.get("#postQuestionButton").click()
    
        // clicks tags
        cy.get("#sideBarTags").click()
        cy.contains("test1-tag1").click();
        cy.contains("Test Question A");
    });


it("Clicks on a tag and verifies the tag is displayed", () => {
    const tagNames = "javascript";

    cy.get("#sideBarTags").click()

    cy.contains(tagNames).click();
    cy.get(".question_tags").each(($el, index, $list) => {
    cy.wrap($el).should("contain", tagNames);
    });
});

it("Clicks on a tag in homepage and verifies the questions related tag is displayed", () => {
    const tagNames = "storage";

    //clicks the 3rd tag associated with the question.
    cy.get(".question_tag_button").eq(0).click();

    cy.get(".question_tags").each(($el, index, $list) => {
    cy.wrap($el).should("contain", tagNames);
    });
});

});


