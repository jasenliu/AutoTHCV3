import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel, copyAndCompareExcelByGivenFile, waitLoading } from "./utils"
const { faker } = require("@faker-js/faker")
const path = require('path')

describe('Strategy Manager', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }

        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Optimization Analytics')
        clickLinkByName('Strategy Manager')
        waitLoading(10000)
    })

    it('Strategy Manager -> Bank Based Expert System', () => {
        // click Create New Expert Strategy button
        cy.get('input[value="Create New Expert Strategy"]').click()
        waitLoading(60000)
        // input description
        const fakerDesc = faker.random.words()
        cy.get('.el-textarea__inner').type(fakerDesc)
        //select buy basket
        // check treasury header checkbox 
        cy.get('.header-checkbox').click()
        // click add button
        cy.contains('Add').click()
        // select sell basket
        // click Brokered Deposits tab
        cy.contains('Brokered Deposits').click()
        waitLoading(20000)
        cy.contains('Retail CD 5yr', {timeout: 60000}).should('be.visible')
        // check Brokered Deposits header checkbox 
        cy.get('.header-checkbox').click()
        // click add button
        cy.contains('Add').click()
        // click create button
        cy.get('input[value="Create"]').click()
        waitLoading(10000)

        cy.get('.el-message-box__message p').then(($p) => {
            const text = $p.text()
            // get strategId  from pop-up dialog
            const strategId = text.match(/\d+/)[0]
            // click OK button
            cy.get('.el-button').click()
            waitLoading(60000)
            // assert strategId exists in the page
            cy.contains(strategId).should('exist')
            // assert desc exists in the page
            cy.contains(fakerDesc).should('exist')

            // click the first edit icon(the new added strategy)
            cy.get('.el-icon-edit').first().click()
            waitLoading(20000)
            // assert the desc show in edit stategy page
            cy.get('.el-textarea__inner').should('have.value', fakerDesc)
            // click Download Strategy File button
            cy.get('input[value="Download Strategy File"]').click()
            copyAndCompareExcelByGivenFile('StrategyFile')
            // select one item in the buy basket
            cy.get('.trade-basket-side .ag-cell .ag-checkbox-input').eq(0).check()
            // select one item in the funding basket
            cy.get('.trade-basket-side').eq(1).find('.ag-cell .ag-checkbox-input').eq(0).check() 
            // click remove button
            cy.contains('Remove').click()
            // click save button
            cy.get('input[value="Save"]').click()
            waitLoading(20000)
            // assert update success info
            cy.contains('The strategy updated to the Trade Simulation dashbord').should('exist')
            // click OK button
            cy.get('.el-button').click()

            // click the first edit icon(the new added strategy)
            cy.get('.el-icon-edit').first().click()
            waitLoading(20000)
            // click save as button
            cy.get('input[value="Save As"]').click()
            waitLoading(10000)
            cy.get('.el-message-box__message p').then(($p) => {
                const text = $p.text()
                // get strategId  from pop-up dialog
                const strategId = text.match(/\d+/)[0]
                // click OK button
                cy.get('.el-button').click()
                // assert strategId exists in the page
                cy.contains(strategId).should('exist')
                // assert desc exists in the page
                cy.contains(fakerDesc).should('exist')
                // delete the save as strategy
                cy.get('.el-icon-delete').first().click()
                // delete the init create strategy
                cy.get('.el-icon-delete').first().click()
            })

            // Upload Expert Strategy File 
            // click Create New Expert Strategy button
            cy.get('input[value="Create New Expert Strategy"]').click()
            waitLoading(30000)
            cy.get('.el-checkbox__original').check({force: true})
            // click sample file button
            cy.get('input[value="Sample file"]').click()
            copyAndCompareExcel()
            // upload sample file
            cy.get('#UploadFile').selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'sample-expert-strategy-file.xlsx'), {force: true})
            // click upload button
            cy.get('input[value="Upload"]').click()
            waitLoading(10000)
            cy.get('.el-message-box__message p').then(($p) => {
                const text = $p.text()
                // get strategId  from pop-up dialog
                const strategId = text.match(/\d+/)[0]
                // click OK button
                cy.get('.el-button').click()
                // assert strategId exists in the page
                cy.contains(strategId).should('exist')
                // assert caclulating show in the page
                cy.contains('Calculating', {timeout: 60000}).should('exist')
                // delete the created strategy
                cy.get('.el-icon-delete').first().click()
            })
        })

    })
})