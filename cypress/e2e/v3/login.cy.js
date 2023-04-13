describe('login', () => {
    
    it('right username and password', () => {
        if (Cypress.env('isCnSite')) {
            cy.visit('/Account/Login')
            cy.get('#Login').type(Cypress.env('v3_cn_username'))
            cy.get('#Password').type(Cypress.env('v3_cn_password'))
        } else {
            cy.visit(Cypress.env('v3_com_baseUrl') + '/Account/Login')
            cy.get('#Login').type(Cypress.env('v3_com_username'))
            cy.get('#Password').type(Cypress.env('v3_com_password'))
        }
        cy.get('#rm_submit_btn').click()

        cy.url().should('include', 'almhome')
    })

    it('right username but wrong password', () => {
        if (Cypress.env('isCnSite')) {
            cy.visit('/Account/Login')
        } else {
            cy.visit(Cypress.env('v3_com_baseUrl') + '/Account/Login')
        }
        cy.get('#Login').type('v3_ljs')
        cy.get('#Password').type('2sdfadsf')
        cy.get('#rm_submit_btn').click()

        cy.get('[color="red"]').should('contain', 'times to login')
    })

    it('wrong username', () => {
        if (Cypress.env('isCnSite')) {
            cy.visit('/Account/Login')
        } else {
            cy.visit(Cypress.env('v3_com_baseUrl') + '/Account/Login')
        }
        cy.get('#Login').type('addgdf')
        cy.get('#Password').type('2fasdfsdf')
        cy.get('#rm_submit_btn').click()

        cy.get('[color="red"]').should('include.text', 'Incorrect username or password!')
    })
})
