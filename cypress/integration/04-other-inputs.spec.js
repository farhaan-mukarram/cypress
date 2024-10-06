/// <reference types="cypress" />

describe('Secret Menu Items', () => {
  beforeEach(() => {
    cy.visit('/secret-menu');

    cy.get('#minimum-rating-visibility').as('rating-filter');
    cy.get('#restaurant-visibility-filter').as('restaurant-filter');
  });

  it('should set the range and verify it', () => {
    // change range
    cy.get('@rating-filter').invoke('val', 4).trigger('change');

    // verify that the label contains the new value
    cy.get('@rating-filter').siblings('label').contains('4');
  });

  it('should check the checkbox and verify it', () => {
    cy.get('input[type="checkbox"]')
      // get the first checkbox
      .first()
      .then(($checkbox) => {
        // check checkbox
        cy.wrap($checkbox).check();

        // verify that it is checked
        cy.wrap($checkbox).should('be.checked');
      });
  });

  it('should select an option from the select and verify it', () => {
    cy.get('@restaurant-filter')
      .children()
      // get the last menu option
      .last()
      // get its text content
      .invoke('text')
      .then((text) => {
        // select option using text
        cy.get('@restaurant-filter').select(text);

        // verify that the filter shows the selected value
        cy.get('@restaurant-filter').should('have.value', text);
      });
  });
});
