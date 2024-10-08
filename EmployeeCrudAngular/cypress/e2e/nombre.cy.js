describe('Validación: Nombre contiene números', () => {
    it('Debe mostrar un mensaje de error cuando el nombre contiene números', () => {
        const baseUrl = Cypress.env('baseUrl'); // Obtener la URL desde las variables de entorno

        // Verificar si baseUrl está definido
        if (!baseUrl) {
            throw new Error('Error: baseUrl is not defined. Please check your environment variables.');
        }

        cy.visit(baseUrl + '/addemployee/'); // Usar la URL construida
        cy.get('input[name="name"]').type('Paulina05'); 
        cy.get('.btn').click();
        
        // Comprobar que se muestre el mensaje de error
        cy.get('.toast-message').should('contain.text', 'El nombre no puede tener números.');
    });
});

