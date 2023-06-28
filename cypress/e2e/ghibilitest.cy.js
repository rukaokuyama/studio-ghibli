describe('Studio Ghibli Filmography', () => {
  it('Displays film details when a film thumbnail is clicked', () => {
    cy.visit('http://localhost:5500');

    // test for thumbnail
    cy.get('.film-thumbnail').first().click();

    // verify filmTitle and film detail
    cy.get('#filmTitle').should('exist');
    cy.get('#filmDetails').should('exist');
  });

  it('Filters films based on search input',() => {
    cy.visit('http://localhost:5500');

    // search for totoro in the search bar
    cy.get('#searchBar').type('My Neighbor Totoro');

    cy.get('.film-title').should('contain', 'My Neighbor Totoro');
  })
});
