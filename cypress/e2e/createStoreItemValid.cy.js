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

  it('should successfully create, read store item with valid data', () => {
    cy.visit('/store/create');

    // Upload image (make sure this file exists in cypress/fixtures)
    cy.get('input[type="file"]').attachFile('sample.jpg');

    // Fill in the form fields
    cy.get('input[id="itemNo"]').type('ITEM001');
    cy.get('input[id="itemName"]').type('Hair Gel');
    cy.get('textarea[id="description"]').type('High quality hair gel for styling.');
    cy.get('input[id="quantity"]').type('10');
    cy.get('input[id="cost"]').type('500');
    cy.get('input[id="sPrice"]').type('750');

    // Submit form
    cy.get('button[type="submit"]').click();

     // Wait for SweetAlert popup and click "OK"
     cy.get('.swal2-popup').should('be.visible');
     cy.get('.swal2-confirm').click();

    // Wait for alert and redirection
    cy.url({ timeout: 10000 }).should('include', '/store');
    cy.contains('Item List').should('exist');

     // Wait for the table to load
     cy.get('table').should('exist');

  });

});