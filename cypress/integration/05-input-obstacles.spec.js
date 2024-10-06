/// <reference types="cypress" />

describe('Input obstacles', () => {
  beforeEach(() => {
    cy.visit('/obstacle-course');
  });

  it('should input text into the input field', () => {
    const thought = 'Ravioli are a form of pop tart.';

    cy.get('[data-test="text-input"]').type(thought);
    cy.get('[data-test="text-result"]').contains(thought);
  });

  it('should control a select input', () => {
    cy.get('[data-test="select-input"]').select('Thor');

    cy.get('[data-test="select-result"]').contains('Thor');
  });

  it('should find and control a checkbox input', () => {
    cy.get('[data-test="checkbox-result"]').contains('(None)');

    cy.get('[data-test="checkbox-tomato"]').check();
    cy.get('[data-test="checkbox-result"]').contains('Tomato');
  });

  it('should find and control a radio input', () => {
    cy.get('[data-test="radio-ringo"]').check();
    cy.get('[data-test="radio-result"]').contains('Ringo');
  });

  it('should find and control a color input', () => {
    cy.get('[data-test="color-input"]').invoke('val', '#000000').trigger('input');
    cy.get('[data-test="color-result"]').contains('#000000');
  });

  it('should find and control a date input', () => {
    cy.get('[data-test="date-input"]').invoke('val', '2022-06-14').trigger('input');
    cy.get('[data-test="date-result"]').contains('2022-06-14');
  });

  it('should find and control a range input', () => {
    cy.get('[data-test="range-input"]').invoke('val', '5').trigger('change');
    cy.get('[data-test="range-result"]').contains('5');
  });

  it('should find and control a file input', () => {
    cy.get('[data-test="file-input"]').selectFile('cypress/fixtures/file.json');
    cy.get('[data-test="file-result"]').contains('file.json');
  });
});
