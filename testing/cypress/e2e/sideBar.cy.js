
describe("Open sideBar", () => {
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

    it("should open sideBar", () => {
        cy.get("#menuIcon").click();
        cy.contains("Home");
        cy.contains("Questions");
        cy.contains("Tags");
        cy.contains("Users");
        cy.contains("Logout");
    });
});
