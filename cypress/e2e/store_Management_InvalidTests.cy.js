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
  
    // Fill everything correctly except quantity
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

  // Ensure form is ready
  cy.get('form').should('exist');

  // Clear the Item Name field
  cy.get('input#itemName').should('not.be.disabled').clear();

  // Try submitting the form using native form submission (preferred)
  cy.get('form').then(($form) => {
    const formElement = $form[0];
    const itemNameInput = formElement.querySelector('#itemName');

    // Force the browser to check validity (this time directly on the input)
    const isValid = itemNameInput.checkValidity();

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

  it('should show no items found when searching for a non-existing Item Name', () => {
  cy.visit('/store');

  // Ensure the table is initially loaded
  cy.get('table tbody tr').should('exist');

  // Enter a random non-existing string into the search bar
  cy.get('input[type="text"]').clear().type('ThisItemDoesNotExist123456');

  // Assert that the table shows the 'No items found' message
  cy.get('table tbody').should('contain', 'No items found');
});

});
