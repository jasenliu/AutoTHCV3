import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel } from "./utils"
const path = require('path')
const { faker } = require("@faker-js/faker")

describe('Portfolio Management', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }
        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Port Analytics & Reporting')
        clickLinkByName('Portfolio Management')
        cy.wait(1000)
    })

    it('Portfolio Management -> upload portfolio/delete', () => {
        //click Upload Portfolio button
        cy.contains('Upload Portfolio').click()
        //click cancel button
        cy.get('input[value="Cancel"]').click()
        //click Upload Portfolio button
        cy.contains('Upload Portfolio').click()
        //upload path file
        cy.get('input[name="exlFile"]').selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'PATH-sample-Whole_Loan_file_min.xlsx'), {force: true})
        //input portfolio name
        const portfolio_name = faker.random.words()
        cy.get('input[name="portfolioName"]').type(portfolio_name)
        //click upload button
        cy.get('input[value="Upload"]').click()
        //assert path file uploaded successfully 
        cy.contains('Upload Successfully.').should('exist')
        //assert path file build successfully 
        cy.contains(portfolio_name).parents('td').next().next().next().next().find('img[title="Download excel file"]', {timeout: 10000}).should('exist')

        //delete portfolio
        cy.contains(portfolio_name).parents('td').prev().find('input[type="checkbox"]').check({force: true})
        cy.contains('Delete').click({force: true})
        cy.on('window:alert', (text) => {
            //assert delete message
            expect(text).to.be.eq('Are you sure you want to delete these Items?')
        })
    })

    it('Portfolio Management -> generate report/delete', () => {
        //click Generate Report tab
        cy.contains('Generate Report').click()
        //click select Portfolio icon
        cy.get('div.cbdbutton.noborder').click()
        //select the first portfolio in the list
        cy.get('div.tree.box table.el-table__body tbody tr').first().click()
        //select the EVE Report
        cy.get('input.el-checkbox__original').eq(1).click({force: true})
        //input report name
        const report_name = faker.random.words()
        cy.get('input[name="txtName"]').clear()
        cy.get('input[name="txtName"]').type(report_name)
        //click the Generate button
        cy.get('input[name="btn_generate"]').click()
        //assert report successfully generated
        cy.contains('Calculating...',{timeout: 30000}).should('exist')

        //delete the report
        //cy.contains(report_name).parents('td').prev().find('input[type="checkbox"]').check({force: true})
        cy.get('table.lcentral_CECL tbody tr td input').eq(0).check()
        //click delete link
        cy.get('#chball_portfolio').next().next().click()
        cy.on('window:alert', (text) => {
            //assert delete message
            expect(text).to.be.eq('Are you sure you want to delete these items?')
        })
    })
})