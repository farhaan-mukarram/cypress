/// <reference types="cypress" />
const item = 'Test Item';

describe('Basic Practice', () => {
  beforeEach(() => {
    cy.visit('/jetsetter');
  });

  describe('Adding a new item', () => {
    it('should put a new item on the page after clicking on "Add Item"', () => {
      // select input field and type item
      cy.get('[data-test="new-item-input"]').type(item);

      // select button to add item and click it
      cy.get('[data-test="add-item"]').click();

      // assert that the item has been added to the page
      cy.contains(item);
    });

    it('should put a new item in the "Unpacked Items" list', () => {
      // select input field and type item
      cy.get('[data-test="new-item-input"]').type(item);

      // select button to add item and click it
      cy.get('[data-test="add-item"]').click();

      // assert the that the item has been inserted into the unpacked list
      cy.get('[data-test="items-unpacked"] > ul').contains(item);
    });

    it('should put a new item as the last item in the "Unpacked Items" list', () => {
      // select input field and type item
      cy.get('[data-test="new-item-input"]').type(item);

      // select button to add item and click it
      cy.get('[data-test="add-item"]').click();

      // assert the that the item has been inserted at the end of unpacked list
      cy.get('[data-test="items-unpacked"] > ul > li').last().contains(item);
    });
  });

  describe('Filtering items', () => {
    it('should show items that match whatever is in the filter field', () => {
      // select the filter input and type filter query
      cy.get('[data-test="filter-items"]').type('Tooth');

      // Verify that filtered items are on the page
      cy.get('[data-test="items"] li').each(($item) => {
        cy.wrap($item).contains('Tooth');
      });
    });

    it('should hide items that do not match whatever is in the filter field', () => {
      // select the filter input and type filter query
      cy.get('[data-test="filter-items"]').type('iPhone');

      // Verify that other items are hidden
      cy.contains('Tooth').should('not.exist');
    });
  });

  describe('Removing items', () => {
    describe('Remove all', () => {
      it('should remove all of the items', () => {
        // find and click the remove all button
        cy.get('[data-test="remove-all"]').click();

        // verify that the unpacked items list is empty and shows empty error message
        cy.get('[data-test="items-unpacked"]').contains('No items to show.');

        // verify that the packed items list is empty and shows empty error message
        cy.get('[data-test="items-packed"]').contains('No items to show.');
      });
    });

    describe('Remove individual items', () => {
      it('should have a remove button on an item', () => {
        cy.get('[data-test="items"]').each(($item) => {
          cy.wrap($item).get('[data-test="remove"]');
        });
      });

      it('should remove an item from the page', () => {
        // select all list items
        cy.get('[data-test="items"] li')
          // select first item
          .first()
          .then(($item) => {
            // find remove button and click it
            cy.wrap($item).find('[data-test="remove"]').click();

            // assert that the item no longer exists
            cy.wrap($item).should('not.exist');
          });
      });
    });
  });

  describe('Mark all as unpacked', () => {
    it('should empty out the "Packed" list', () => {
      // click the `Mark All as Unpacked' button
      cy.get('[data-test="mark-all-as-unpacked"]').click();

      // verify that the packed section is empty
      cy.get('[data-test="items-packed"]').contains('No items to show.');
    });

    it('should empty have all of the items in the "Unpacked" list', () => {
      cy.get('[data-test="items"] li')
        .then(($items) => {
          // determine the total number of items
          const totalCount = $items.length;

          return totalCount;
        })
        .then((totalCount) => {
          // click the `Mark All as Unpacked' button
          cy.get('[data-test="mark-all-as-unpacked"]').click();

          // verify that all items are unpacked
          cy.get('[data-test="items-unpacked"] li').should('have.length', totalCount);
        });
    });
  });

  describe('Mark individual item as packed', () => {
    it('should move an individual item from "Unpacked" to "Packed"', () => {
      cy.get('[data-test="items-unpacked"] li')
        // get the first unpacked item
        .first()
        .then(($item) => {
          cy.wrap($item)
            .find('label')
            // find its text content
            .then(($label) => $label.text())
            .then((itemText) => {
              // mark as packed
              cy.wrap($item).find('input[type="checkbox"]').check();

              // verify that the unpacked section no longer contains the item
              cy.get('[data-test="items-unpacked"]').contains(itemText).should('not.exist');

              // verify that the packed section contains the item
              cy.get('[data-test="items-packed"]').contains(itemText);
            });
        });
    });
  });
});
