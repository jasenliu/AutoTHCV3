import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel, copyAndCompareExcelByGivenFile, waitLoading } from "./utils"
const path = require('path')

describe('Loan Structurer', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }

        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Profitability Analytics')
        clickLinkByName('Loan Structurer')
        waitLoading(10000)
    })

    it('Loan Structurer -> submit to pipeline' , () => {
        // edit term value
        cy.contains('Term:').next().find('input').clear()
        cy.contains('Term:').next().find('input').type('55')
        // click Submit to Pipeline button
        cy.contains('Submit to Pipeline').click()
        // go to Loan Pipeline Management app
        //clickLinkByName('Profitability Analytics')
        clickLinkByName('Loan Pipeline Management')
        waitLoading(10000)
        //assert created pipeline exists
        cy.contains('55').should('exist')
        // click edit icon
        cy.get('i.el-icon-edit').first().click()
        waitLoading(5000)
        // edit term value
        cy.contains('Term:').next().find('input').clear()
        cy.contains('Term:').next().find('input').type('66')
        // click submit button
        cy.contains('Submit').click()
        waitLoading(5000)
        cy.contains('66').should('exist')
        cy.get('i.el-icon-download').click()
        copyAndCompareExcel()
        // click delete icon
        cy.get('i.el-icon-delete').first().click()
    })

    it('Loan Structurer -> submit as offering', () => {
        // click submit as offering button
        cy.contains('Submit as Offering').click()
        waitLoading(5000)
        cy.get('div.el-message-box__message p p').then(($p) => {
            const text = $p.text()
            // get loanId from pop-up dialog
            const loanId = text.match(/\d+/)[0]
            // click edit offering link
            cy.contains('Edit Offering').click()
            waitLoading(5000)
            // assert loanId exists in the edit offering page
            cy.contains(loanId).should('exist')
        })
    })

    it('Loan Structurer -> submit to ratesheet', () => {
        // click submit to ratesheet button
        cy.contains('Submit to RateSheet').click()
        cy.on('window:alert', (text) => {
            // assert success message
            expect(text).to.be.eq('successfully updated to Ratesheet')
        })
    })
})