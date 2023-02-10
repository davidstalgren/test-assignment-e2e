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
    cy.intercept('GET', 'http://omdbapi.com/?apikey=416ed51a&s=*', {fixture: "omdbResponse"});
    cy.get('input#searchText').type('Avengers');
    cy.get('button#search').click();
    cy.get('h3').contains('Avengers').should('exist');
  })

  it('should submit with submitevent from form', () => {
    cy.intercept('GET', 'http://omdbapi.com/?apikey=416ed51a&s=*', {fixture: "omdbResponse"});
    cy.get('input#searchText').type('Avengers');
    cy.get('form').submit();
    cy.get('h3').contains('Avengers').should('exist');
  })

  it('should print an error message in a <p> if form is submitted without text in input', () => {
    cy.get('button#search').click();
    cy.get('p').contains('Inga sökresultat att visa').should('exist');
  })

});

describe('check that a real call to api works and non-MOCK data appears', () => {

  it('should have more div.movie elements than 0 after search', () => {
    cy.get('input#searchText').type('Avengers');
    cy.get('form').submit();
    cy.get('div.movie').should('have.length.greaterThan', 0);
  })

});

describe('check that data from api (MOCK) appears', () => {

  it('should have a h3 after search', () => {
    cy.intercept('GET', 'http://omdbapi.com/?apikey=416ed51a&s=*', {fixture: "omdbResponse"});
    cy.get('input#searchText').type('Avengers');
    cy.get('form').submit();
    cy.get('h3').contains('Avengers').should('exist');
    cy.get('h3').contains('MOCK').should('exist');
  })

  it('should have an image after search', () => {
    cy.intercept('GET', 'http://omdbapi.com/?apikey=416ed51a&s=*', {fixture: "omdbResponse"});
    cy.get('input#searchText').type('Avengers');
    cy.get('form').submit();
    cy.get('img').should('exist');
  })

});

describe('should make request from api with correct url', () => {

  it('should request from api with correct url', () => {
    cy.intercept('GET', 'http://omdbapi.com/?apikey=416ed51a&s=*', {fixture: "omdbResponse"}).as('omdbCall');

    cy.get('input#searchText').type('Avengers');
    cy.get('form').submit();

    cy.wait('@omdbCall').its('request.url').should('contain', 'Avengers');

  })
});