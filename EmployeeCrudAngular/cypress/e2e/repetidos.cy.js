describe('Validación: Repetición de caracteres del nombre', () => {
    it('Debe mostrar un mensaje de error cuando el nombre contiene caracteres repetidos excesivamente', () => {
        cy.visit('http://localhost:4200/addemployee/');
        cy.get('input[name="name"]').type('Juuuuaannnn');
        cy.get('.btn').click();
        cy.get('.toast-message').should('contain.text', 'El nombre contiene repeticiones excesivas de caracteres.');
    });
});

