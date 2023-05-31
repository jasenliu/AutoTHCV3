import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel, waitLoading } from "./utils"

describe('Assumption Sensitivity', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }

        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Risk Analytics & Reporting')
        clickLinkByName('Assumption Sensitivity')
        waitLoading(5000)
    })

    it('Assumption Sensitivity', () => {
        // input CPR(%)  with 3
        cy.contains('CPR (%)').parent().next().next().find('input').type('3{enter}')
        // input CDR(%)  with 3
        cy.contains('CDR (%)').parent().next().next().find('input').type('3{enter}')
        // input Decay(%)  with 3
        cy.contains('Decay (%)').parent().next().next().find('input').type('3{enter}')
        // input Up Beta 1yr(%) with 3
        cy.contains('Up Beta 1yr (%)').parent().next().next().find('input').type('3{enter}')
        // assert sum
        cy.get('table.lcentral_fulltd').contains('Sum').parent().next().should('have.text', '-9,711.53')
        // assert After change
        cy.get('table.lcentral_fulltd').contains('After change').parent().next().should('have.text', '49,712.31')
        // click Reset button
        cy.get('input[value="Reset"]').click()
        // assert sum
        cy.get('table.lcentral_fulltd').contains('Sum').parent().next().should('have.text', '0.00')
        // assert After change
        cy.get('table.lcentral_fulltd').contains('After change').parent().next().should('have.text', '59,423.85')
        // click Download EVE Sensitivity link
        cy.contains('Download EVE Sensitivity').click()
        copyAndCompareExcel()
        // click Download EVE and EAR Analysis Sensitivity link
        cy.contains('Download EVE and EAR Analysis Sensitivity').click()
        copyAndCompareExcel()

        // click EAR Sensitivity tab
        cy.contains('EAR Sensitivity').click()
        waitLoading(5000)
        // input CPR(%)  with 3
        cy.contains('CPR (%)').parent().next().next().find('input').type('3{enter}')
        // input CDR(%)  with 3
        cy.contains('CDR (%)').parent().next().next().find('input').type('3{enter}')
        // input Decay(%)  with 3
        cy.contains('Decay (%)').parent().next().next().find('input').type('3{enter}')
        // input Up Beta 1yr(%) with 3
        cy.contains('Up Beta 1yr (%)').parent().next().next().find('input').type('3{enter}')
        // assert sum
        cy.get('table.lcentral_fulltd').contains('Sum').parent().next().should('have.text', '168.26')
        // assert After change
        cy.get('table.lcentral_fulltd').contains('After change').parent().next().should('have.text', '8,277.46')
        // click Reset button
        cy.get('input[value="Reset"]').click()
        // assert sum
        cy.get('table.lcentral_fulltd').contains('Sum').parent().next().should('have.text', '0.00')
        // assert After change
        cy.get('table.lcentral_fulltd').contains('After change').parent().next().should('have.text', '8,109.20')       
        // click Download EaR Sensitivity link
        cy.contains('Download EaR Sensitivity').click()
        copyAndCompareExcel()
    })
})