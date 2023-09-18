import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel, copyAndCompareExcelByGivenFile, waitLoading } from "./utils"
const path = require('path')

describe('Product Profitability', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }

        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Profitability Analytics')
        clickLinkByName('Product Profitability')
        waitLoading(10000)
    })

    it('Product Profitability -> Loan Offer Rates', () => {
        // cycle
        // click upload button directly
        cy.get('input[value="Upload"]').click()
        // assert tips info
        cy.on('window:alert', (text) => {
            expect(text).to.be.eq('Please upload the file first.')
        })
        // upload file
        cy.get('input.ui-input-file').selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'productratesheet.xlsx'), {force: true})
        // click upload button
        cy.get('input[value="Upload"]').click()
        waitLoading(25000)
        // check Terms Conditions
        cy.contains('Terms Conditions').prev().check()
        // assert NACR show in the page
        cy.contains('NACR').should('be.visible')
        // uncheck Terms Conditions
        cy.contains('Terms Conditions').prev().uncheck()
        // assert NACR not show in the page
        cy.contains('NACR').should('not.exist')
        // click Calculate button
        cy.get('input[value="Calculate"]').click()
        waitLoading(25000)
        // assert progress bar
        cy.get('div[role="progressbar"]').should('be.visible')
        // click history icon to pop-up Rate Sheet History page
        cy.get('img[title="History"]').click()
        // click Original RateSheet File Uploaded excel icon
        cy.get('table.lcentral_fulltd tbody tr').first().children().eq(6).find('img').click({force: true})
        copyAndCompareExcel()
        // click export excel icon
        cy.get('table.lcentral_fulltd tbody tr').first().children().eq(7).find('img').click({force: true})
        copyAndCompareExcelByGivenFile('productratesheet(export)')
        // close Rate Sheet History page
        cy.contains('Rate Sheet History').next().click({force: true})
        // click Clear all link
        cy.contains('Clear All').click()
        waitLoading(25000)
        // assert clear all success
        cy.contains('* the rate sheet from rate sheet (THC).').should('be.visible')

        // Evaluation Date
        // check Evaluation Date radio
        cy.contains('Evaluation Date').click()
        // set date
        cy.get('.el-date-editor input').type('06/07/2023{enter}')
        // click upload button directly
        cy.get('input[value="Upload"]').click()
        // upload file
        cy.get('input.ui-input-file').selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'productratesheet.xlsx'), {force: true})
        // click upload button
        cy.get('input[value="Upload"]').click()
        waitLoading(25000)
        // check Terms Conditions
        cy.contains('Terms Conditions').prev().check()
        // assert NACR show in the page
        cy.contains('NACR').should('be.visible')
        // uncheck Terms Conditions
        cy.contains('Terms Conditions').prev().uncheck()
        // assert NACR not show in the page
        cy.contains('NACR').should('not.exist')
        // click Calculate button
        cy.get('input[value="Calculate"]').click()
        waitLoading(25000)
        // assert progress bar
        cy.get('div[role="progressbar"]').should('be.visible')
        // click history icon to pop-up Rate Sheet History page
        cy.get('img[title="History"]').click()
        // click Original RateSheet File Uploaded excel icon
        cy.get('table.lcentral_fulltd tbody tr').first().children().eq(6).find('img').click({force: true})
        copyAndCompareExcel()
        // click export excel icon
        cy.get('table.lcentral_fulltd tbody tr').first().children().eq(7).find('img').click({force: true})
        copyAndCompareExcelByGivenFile('productratesheet(export)')
        // close Rate Sheet History page
        cy.contains('Rate Sheet History').next().click({force: true})
        // click Clear all link
        cy.contains('Clear All').click()
        waitLoading(25000)
        // assert clear all success
        cy.contains('* the rate sheet from rate sheet (THC).').should('be.visible')

    })
})