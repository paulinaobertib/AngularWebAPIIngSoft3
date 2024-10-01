describe('Validación: Nombre contiene números', () => {
    it('Debe mostrar un mensaje de error cuando el nombre contiene números', () => {
        cy.visit('http://localhost:4200/addemployee/');
        cy.get('input[name="name"]').type('Paulina05'); 
        cy.get('.btn').click();
        cy.get('.toast-message').should('contain.text', 'El nombre no puede tener números.');
    });
});
