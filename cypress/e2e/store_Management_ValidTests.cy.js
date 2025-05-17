Cypress.config('baseUrl', 'http://localhost:5173'); 

Cypress.config('defaultCommandTimeout', 100000); 

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

    it('should successfully update store item with valid data', () => {
     // Find the last row and click the Edit icon (scroll it into view first)
     cy.get('table tbody tr').last().within(() => {
       cy.get('a[href^="/store/edit"]')
         .scrollIntoView()
         .click({ force: true }); // Fix for visibility issue
     });
 
     // Wait for edit form and change selling price
     cy.url().should('include', '/store/edit');
     cy.get('input#itemName').clear().type('Sunsilk Hair Gel- Updated'); 
     cy.get('input#description').clear().type('Sunsilk Hair Gel for styling - Updated');
     cy.get('input#sPrice').clear().type('1000'); // Update selling price
 
     // Submit the form
     cy.get('button[type="submit"]').click();
 
     // Assert we’re back at /store and update is reflected
     cy.url({ timeout: 10000 }).should('include', '/store');
     cy.contains('Item List').should('exist');

     cy.get('table').should('exist');

    });

it('should successfully delete store item with valid data', () => {

  // Find the last row and click the Delete icon
  cy.get('table tbody tr').last().within(() => {
    cy.get('a[href^="/store/delete"]')
      .scrollIntoView()
      .click({ force: true });
  });

  // Confirm we're on the delete confirmation page
  cy.url().should('include', '/store/delete/');

  // Click the Delete button to confirm deletion
  cy.contains('button', 'Delete').click();

  // Ensure we’re redirected back to the store list
  cy.url({ timeout: 10000 }).should('include', '/store');
  cy.contains('Item List').should('exist');
   });

  it('should filter store items by Item Name using search', () => {
  cy.visit('/store');

  // Wait until the table and search bar are visible
  cy.get('input[type="text"]').should('exist');
  cy.get('table tbody tr').should('exist');

  // Capture the name of the first item to use as search query
  cy.get('table tbody tr').first().find('td').eq(2).invoke('text').then((itemName) => {
    const trimmedItemName = itemName.trim();

    // Enter the item name into the search bar
    cy.get('input[type="text"]').clear().type(trimmedItemName);

    // Assert that all displayed rows contain the searched name
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).find('td').eq(2).should('contain.text', trimmedItemName);
    });
  });
});


});
