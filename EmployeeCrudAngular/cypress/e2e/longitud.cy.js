describe('Validación: longitud máxima de caracteres', () => {
    it('Debe mostrar un mensaje de error cuando el nombre excede los 100 caracteres', () => {
        cy.visit('http://localhost:4200/addemployee/');
        cy.get('input[name="name"]').type('P'.repeat(101)); 
        cy.get('.btn').click();
        cy.get('.toast-message').should('contain.text', 'El nombre no puede tener más de 100 caracteres.');
    });
});