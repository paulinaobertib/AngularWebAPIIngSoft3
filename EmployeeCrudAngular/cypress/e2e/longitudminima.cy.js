describe('Validación: Longitud mínima del nombre', () => {
    it('Debe mostrar un mensaje de error cuando el nombre tiene menos de 2 caracteres', () => {
        cy.visit('http://localhost:4200/addemployee/');
        cy.get('input[name="name"]').type('P');
        cy.get('.btn').click();
        cy.get('.toast-message').should('contain.text', 'El nombre no puede tener menos de 2 caracteres.');
    });
});
