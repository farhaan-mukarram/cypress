/// <reference types="cypress" />

describe('Aliases', () => {
  beforeEach(() => {
    cy.visit('/jetsetter');
    cy.get('[data-test="filter-items"]').as('filter-input');
    cy.get('[data-test="items"] li').as('all-list-items');
  });

  describe('Filtering items', () => {
    it('should show items that match whatever is in the filter field', () => {
      // select the filter input and type filter query
      cy.get('@filter-input').type('Tooth');

      // Verify that filtered items are on the page
      cy.get('@all-list-items').each(($item) => {
        cy.wrap($item).contains('Tooth');
      });
    });

    it('should hide items that do not match whatever is in the filter field', () => {
      // select the filter input and type filter query
      cy.get('@filter-input').type('iPhone');

      // Verify that other items are hidden
      cy.contains('Tooth').should('not.exist');
    });
  });
});
