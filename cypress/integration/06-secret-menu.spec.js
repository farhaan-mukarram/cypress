/// <reference types="cypress" />

const restaurants = [
  'Chick-fil-A',
  'McDonalds',
  'In-N-Out',
  'KFC',
  'Jack In The Box',
  'Jamba Juice',
  'Starbucks',
  'Dairy Queen',
  'Burger King',
  'Chipotle',
  'Taco Bell',
  'Five Guys',
  'Sonic',
  'Subway',
  'Panera Bread',
];

const properties = [
  'name',
  'whereToOrder',
  'description',
  'secret',
  'ingredients',
  'popularity',
  'price',
  'howToOrder',
];

const ratings = [1, 2, 3, 4, 5, 6, 7];

describe('Secret Menu Items', () => {
  beforeEach(() => {
    cy.visit('/secret-menu');
  });

  it('should exist have the title on the page', () => {
    cy.get('h1').should('contain', 'Secret Menu Items');
  });

  for (const property of properties) {
    it(`should have a column for ${property}`, () => {
      cy.get(`#${property}-column`);
    });

    it(`should have a column for showing the ${property} column`, () => {
      cy.get(`#show-${property}`);
    });

    it('should hide the column when the checkbox is unchecked', () => {
      cy.get(`#show-${property}`).click();
      cy.get(`#${property}-column`).should('be.hidden');
    });
  }

  describe('Ratings filter', () => {
    // generate tests for ratings
    for (const rating of ratings) {
      it(`should filter items with minimum rating ${rating}`, () => {
        // update the input to the rating
        cy.get('#minimum-rating-visibility').invoke('val', rating).trigger('input');

        // get cells under the popularity column
        cy.get('.popularity .cell').then(($cells) => {
          for (const $cell of $cells) {
            // get cell value
            const cellValue = +$cell.textContent;

            // assert that it is greater than or equal to the rating
            expect(cellValue).gte(rating);
          }
        });
      });
    }
  });

  describe('Restaurants filter', () => {
    // generate tests for restaurants
    for (const restaurant of restaurants) {
      it(`should filter items with restaurant name ${restaurant}`, () => {
        // select the restaurant
        cy.get('#restaurant-visibility-filter').select(restaurant);

        // get cells under the where to order column
        cy.get('td[headers="whereToOrder-column"] .cell').then(($cells) => {
          for (const $cell of $cells) {
            // get cell value
            const name = $cell.textContent;

            // assert that it matches restaurant name
            expect(name).includes(restaurant);
          }
        });
      });
    }
  });
});
