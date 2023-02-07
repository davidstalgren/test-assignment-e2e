beforeEach(() => {
  cy.visit('/');
});

describe('base elements on loading page', () => {

  it('should contain input field', () => {
    cy.get('input#searchText').should('exist');
  })

  it('should contain search button with text Sök', () => {
    cy.get('button#search').contains('Sök').should('exist');
  })

});

describe('typing, clicking and submitting', () => {

  it('should be able to type in inputfield', () => {
    cy.get('input#searchText').type('Avengers').should('have.value', 'Avengers');
  })

  it('should submit with click on searchbutton', () => {
    cy.get('input#searchText').type('Avengers');
    cy.get('button#search').click();
    cy.get('h3').contains('Avengers').should('exist');
  })

  it('should submit with submitevent from form', () => {
    cy.get('input#searchText').type('Avengers');
    cy.get('form').submit();
    cy.get('h3').contains('Avengers').should('exist');
  })

  it('should print an error message in a <p> if form is submitted without text in input', () => {
    cy.get('button#search').click();
    cy.get('p').contains('Inga sökresultat att visa').should('exist');
  })

});

describe('check that stuff from api appears', () => {

  it('should have a h3 after search', () => {
    cy.get('input#searchText').type('Avengers');
    cy.get('form').submit();
    cy.get('h3').contains('Avengers').should('exist');
  })

  it('should have an image after search', () => {
    cy.get('input#searchText').type('Avengers');
    cy.get('form').submit();
    cy.get('img').should('exist');
  })

});

/* cy.intercept('METHOD', 'URL/*', {testdata}).as('apiCall'); */

describe('should get mock data with correct url', () => {

  it('should get mockdata', () => {
    cy.intercept('GET', 'http://omdbapi.com/?apikey=416ed51a&s=*', {fixture: "omdbResponse"}).as('omdbCall');

    cy.get('input#searchText').type('Avengers');
    cy.get('form').submit();

    cy.wait('@omdbCall').its('request.url').should('contain', 'Avengers');
    
  })
});