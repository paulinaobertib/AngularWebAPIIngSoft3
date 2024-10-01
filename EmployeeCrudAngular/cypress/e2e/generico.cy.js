describe('Validación: Nombre genérico o trivial', () => {
    it('Debe mostrar un mensaje de error cuando el nombre es genérico o trivial', () => {
        cy.visit('http://localhost:4200/addemployee/');
        cy.get('input[name="name"]').type('Empleado');
        cy.get('.btn').click();
        cy.get('.toast-message').should('contain.text', 'El nombre no puede ser genérico o trivial.');
    });
});
