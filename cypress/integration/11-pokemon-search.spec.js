/// <reference types="cypress" />

const pokemon = [
  { id: 1, name: 'Bumblesaur' },
  { id: 2, name: 'Charmer' },
  { id: 3, name: 'Turtle' },
];

describe('Pokémon Search', () => {
  beforeEach(() => {
    cy.visit('/pokemon-search');

    cy.get('[data-test="search"]').as('search');
    cy.get('[data-test="search-label"]').as('label');

    cy.intercept('/pokemon-search/api?*').as('api');
  });

  it('should call the API when the user types', () => {
    cy.get('@search').type('bulba');
    cy.wait('@api');
  });

  it('should update the query parameter', () => {
    cy.get('@search').type('squir');
    cy.wait('@api');
    cy.location('search').should('equal', '?name=squir');
  });

  it('should call the API with correct query parameter', () => {
    cy.get('@search').type('char');
    cy.wait('@api').then((interception) => {
      expect(interception.request.url).to.contain('name=char');
    });
  });

  it('should pre-populate the search field with the query parameter', () => {
    cy.visit({ url: '/pokemon-search', qs: { name: 'char' } });
    cy.get('@search').should('have.value', 'char');
  });

  it('should render the results to the page', () => {
    // Intercept request and add stubbed response
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed');

    // Trigger request
    cy.get('@search').type('test');

    // Wait for network request to fire
    cy.wait('@stubbed');

    // Assert that stub data is rendered correctly
    cy.get('[data-test="results"]').children().its('length').should('eq', pokemon.length);
  });

  it('should link to the correct pokémon', () => {
    // Intercept request and add stubbed response
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed');

    // Trigger request
    cy.get('@search').type('test');

    // Wait for network request to fire
    cy.wait('@stubbed');

    // Assert all results link correctly
    cy.get('[data-test="result"] a').each(($pokemonEl, index) => {
      const currPokemon = pokemon[index];
      const { id } = currPokemon;

      const link = $pokemonEl.attr('href');
      expect(link).to.contain(`/pokemon-search/${id}`);
    });
  });

  it('should persist the query parameter in the link to a pokémon', () => {
    const searchQuery = 'test';

    // Intercept request and add stubbed response
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed');

    // Trigger request
    cy.get('@search').type(searchQuery);

    // Wait for network request to fire
    cy.wait('@stubbed');

    // Assert all results contain search query
    cy.get('[data-test="result"] a').each(($pokemonEl) => {
      const link = $pokemonEl.attr('href');
      expect(link).to.contain(`?name=${searchQuery}`);
    });
  });

  it('should bring you to the route for the correct pokémon', () => {
    // Stub network requests
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');
    cy.intercept('/pokemon-search/api/1', { fixture: 'bulbasaur.json' }).as('individual-api');

    // Trigger request by changing search term
    cy.get('@search').type('bulba');
    cy.wait('@stubbed-api');

    // Click the first link
    cy.get('[data-test="result"] a').first().click();
    cy.wait('@individual-api');

    // Verify that the route is correct
    cy.location('pathname').should('contain', '/pokemon-search/1');
  });

  it('should immediately fetch a pokémon if a query parameter is provided', () => {
    cy.visit({ url: '/pokemon-search', qs: { name: 'char' } });

    // Intercept request and add stubbed response
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed');

    // Verify that the request contains the correct query param
    cy.wait('@stubbed').then((interception) => {
      expect(interception.request.url).to.contain('name=char');
    });
  });
});
