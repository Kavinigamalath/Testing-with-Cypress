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

   it('should prevent submission and show validation error when fields are empty in add store item form', () => {
    cy.visit('/store/create');
  
    // Try submitting form without filling anything
    cy.get('button[type="submit"]').click();
  
    // Check that the file input triggered a browser-level validation error
    cy.get('input[type="file"]')
      .then(($input) => {
        expect($input[0].validationMessage).to.eq('Please select a file.');
      });
  
    // (Optional) Confirm still on same page
    cy.url().should('include', '/store/create');
  });
  
  it('should show error if image is not uploaded in add store item form', () => {
    cy.visit('/store/create');
  
    // Fill everything except image
    cy.get('input[id="itemNo"]').type('ITEM002');
    cy.get('input[id="itemName"]').type('Test');
    cy.get('textarea[id="description"]').type('Test item');
    cy.get('input[id="quantity"]').type('5');
    cy.get('input[id="cost"]').type('100');
    cy.get('input[id="sPrice"]').type('150');
  
    cy.get('button[type="submit"]').click();
  
    // Native validation prevents submission
    cy.get('input[type="file"]').then($input => {
      expect($input[0].validationMessage).to.eq('Please select a file.');
    });
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

it('should show browser validation when Item Name is empty in edit store item form', () => {
    cy.visit('/store');
  
    cy.get('table tbody tr').last().within(() => {
      cy.get('a[href^="/store/edit"]').scrollIntoView().click({ force: true });
    });
  
    // Clear the Item Name field
    cy.get('input#itemName').clear();
  
    // Try submitting form
    cy.get('form').then(($form) => {
      const formElement = $form[0];
      const itemNameInput = formElement.querySelector('#itemName');
  
      // Use native browser method to trigger validation
      const isValid = formElement.reportValidity();
  
      // Expect form to be invalid and validationMessage to be present
      expect(isValid).to.be.false;
      expect(itemNameInput.validationMessage).to.eq('Please fill out this field.');
    });
  });

  it('should show custom error for negative Selling Price in edit store item form', () => {
    cy.visit('/store');
  
    // Click edit for last item
    cy.get('table tbody tr').last().within(() => {
      cy.get('a[href^="/store/edit"]').scrollIntoView().click({ force: true });
    });
  
    // Set SPrice to negative
    cy.get('input#sPrice').clear().type('-50');
  
    // Submit form
    cy.get('button[type="submit"]').click();
  
    // Wait for custom Swal alert
    cy.get('.swal2-popup').should('be.visible');
    //cy.get('.swal2-title').should('contain', 'error');
    cy.get('.swal2-html-container').should('contain', 'Selling Price must be a positive number');
  });

});
