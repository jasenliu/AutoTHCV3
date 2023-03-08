describe('login', () => {
    
    it('right username and password', () => {
        cy.visit('/Account/Login')
        cy.get('#Login').type(Cypress.env('v3_cn_username'))
        cy.get('#Password').type(Cypress.env('v3_cn_password'))
        cy.get('#rm_submit_btn').click()

        cy.url().should('include', 'almhome')
    })

    it('right username but wrong password', () => {
        cy.visit('/Account/Login')
        cy.get('#Login').type('v3_ljs')
        cy.get('#Password').type('2')
        cy.get('#rm_submit_btn').click()

        cy.get('[color="red"]').should('contain', 'times to login')
    })

    it('wrong username', () => {
        cy.visit('/Account/Login')
        cy.get('#Login').type('addgdf')
        cy.get('#Password').type('2')
        cy.get('#rm_submit_btn').click()

        cy.get('[color="red"]').should('include.text', 'Incorrect username or password!')
    })
})
