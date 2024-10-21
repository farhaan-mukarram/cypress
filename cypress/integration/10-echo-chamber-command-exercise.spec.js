/// <reference types="cypress" />

const user = {
  email: 'first@example.com',
  password: 'password123',
};

describe('Sign Up', () => {
  beforeEach(() => {
    cy.task('reset');
  });

  it('should successfully create a user when entering an email and a password', () => {
    // Sign Up
    cy.signUp(user);

    // Sign In
    cy.signIn(user);

    cy.location('pathname').should('contain', '/echo-chamber/posts');
    cy.contains('Signed in as ' + user.email);
  });
});

describe('Sign In', () => {
  beforeEach(() => {
    cy.visit('/echo-chamber/sign-in');
    cy.task('seed');
  });

  it('should sign in with an existing user', () => {
    cy.signIn(user);

    cy.location('pathname').should('contain', '/echo-chamber/posts');
    cy.contains('Signed in as ' + user.email);
  });
});

describe('Allow an authenticated user to access posts', () => {
  it('should allow authenticated user to view posts', () => {
    cy.get('section#posts').children().its('length').should('be.gt', 0);
  });

  it('should allow authenticated user to preview a post', () => {
    cy.get('section#posts').children().first().as('first-post').click();

    cy.location('pathname').should('contain', '/posts/');

    cy.get('@first-post').within(() => {
      cy.get('.post-content').invoke('text').as('post-text-content');
    });

    cy.get('@post-text-content').then((content) => {
      cy.get('[data-test="post-detail"]').contains(content);
    });
  });

  // TODO: Add tests for other CRUD operations
});

describe('Sign In (unauthorised case)', () => {
  beforeEach(() => {
    cy.task('reset');
    cy.visit('/echo-chamber/sign-in');
  });

  it('should not allow login for an unregistered user', () => {
    cy.signIn(user);

    cy.location('pathname').should('contain', '/sign-in');
    cy.get('main').contains('No such user exists');
  });
});
