/// <reference types="cypress" />

describe('Initial Page', () => {
  beforeEach(() => {
    cy.task('reset');
    cy.visit('/echo-chamber');
  });

  it('should have the title of the application in the header', () => {
    cy.get('[data-test="application-title"]').should('contain', 'Echo Chamber');
  });

  it('should have the title of the application in the window', () => {
    cy.title().should('contain', 'Echo Chamber');
  });

  it('should have a "Sign In" button', () => {
    cy.get('[data-test="sign-in"]');
  });

  it('should have a "Sign Up" button', () => {
    cy.get('[data-test="sign-up"]');
  });

  it('should navigate to "/sign-in" when you click the "Sign In" button', () => {
    cy.get('[data-test="sign-in"]').click();
    cy.location('pathname').should('contain', 'sign-in');
  });

  it('should navigate to "/sign-up" when you click the "Sign Up" button', () => {
    cy.get('[data-test="sign-up"]').click();
    cy.location('pathname').should('contain', 'sign-up');
  });
});

describe('Sign Up', () => {
  beforeEach(() => {
    cy.visit('/echo-chamber/sign-up');
    cy.get('[data-test="sign-up-email"]').as('sign-up-input');
    cy.get('[data-test="sign-up-password"]').as('password-input');
    cy.get('[data-test="sign-up-submit"]').as('sign-up-btn');
  });

  it('should require an email', () => {
    cy.get('@sign-up-btn').click();
    cy.get('@sign-up-input').invoke('prop', 'validity').its('valueMissing').should('be.true');
  });

  it('should require that the email actually be an email address', () => {
    cy.get('@sign-up-input').type('test');
    cy.get('@sign-up-btn').click();
    cy.get('@sign-up-input').invoke('prop', 'validity').its('typeMismatch').should('be.true');
  });

  it('should require a password when the email is present', () => {
    cy.get('@sign-up-input').type('test@123.com');
    cy.get('@sign-up-btn').click();
    cy.get('@password-input').invoke('prop', 'validity').its('valueMissing').should('be.true');
  });
});
