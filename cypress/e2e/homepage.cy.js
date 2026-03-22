describe('Homepage test', () => {

  it('should load the website', () => {
    cy.visit('/');
  });

  it('should contain correct h1 text', () => {
    cy.visit('/');
    cy.get('h1').should('contain', 'Hacker Escape Rooms');
  });

});