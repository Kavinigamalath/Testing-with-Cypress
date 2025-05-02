describe('Simple web page test', () => {
    it('should visit the page and check the title', () => {
        // Visit the page
        cy.visit('https://example.cypress.io');

        cy.title().should('include', 'Cypress');

        cy.contains('type').click();

        cy.url().should('include', '/commands/actions');
        
        cy.get('.action-email')
            .type('student@example.com')
            .should('have.value','student@example.com');

    });
});