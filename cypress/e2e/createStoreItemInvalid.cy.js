Cypress.config('baseUrl', 'http://localhost:5173'); 

Cypress.config('defaultCommandTimeout', 10000); 

Cypress.on('uncaught:exception', () => false)

describe('Store Management functional testing', () => {

  beforeEach(() => {
    // Log in as Store Admin before each test
    cy.visit('/clogin');
    cy.get('input[placeholder="Username"]').type('Store');
    cy.get('input[placeholder="Password"]').type('Store123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/store');

});
    
      it('should show error for invalid quantity input in add store item form', () => {
        cy.visit('/store/create');
      
        cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.jpg');
        cy.get('input[id="itemNo"]').type('ITEM003');
        cy.get('input[id="itemName"]').type('Shampoo');
        cy.get('textarea[id="description"]').type('Invalid quantity');
        cy.get('input[id="quantity"]').type('abc'); // invalid quantity
        cy.get('input[id="cost"]').type('50');
        cy.get('input[id="sPrice"]').type('75');
      
        cy.get('button[type="submit"]').click();
      
        cy.contains("Quantity must be a positive integer").should('exist');
      });

  });
