describe("Not Found Page", () => {
    it("should display not found page", () => {
        cy.visit("http://localhost:3000/invalid");
        cy.contains("Page Not Found");
    });
});
