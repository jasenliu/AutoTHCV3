import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel, popConfirm } from "./utils"
const path = require('path')

describe('Income Simulation', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }
        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Performance Simulation')
        clickLinkByName('Income Simulation')
        cy.wait(1000)
    })
    it('Income Simulation-> create fund', () => {
        //const fundName = faker.random.words()
        const checkReport = (beginTime) => {
            cy.get('body').then(($body) => {
                const endTime = new Date()
                const diffNumber = Number(endTime) - Number(beginTime)
                if (diffNumber > 5 * 60 * 1000) {// more than 4 minutes
                    console.log("income simulation report generate time over.")
                    return
                }
                if ($body.find('[role="progressbar"]').length) {
                    console.log("income simulation report is generating...")
                } else {
                    cy.contains('Download Simulate Report').click({force:true})
                    copyAndCompareExcel()
                    return
                }
                cy.wait(20 * 1000)
                checkReport(beginTime)
            })
        }
        //click New Fund/Portfolio button
        cy.contains('New Fund/Portfolio').click()
        //click cancel button
        cy.get('[style="margin-top: 20px; margin-left: 2%;"] > .buttonBar_noBack').click()
        //assert create fund dialog not exists
        cy.contains('Create Fund').should('not.exist')

        //click New Fund/Portfolio button
        cy.contains('New Fund/Portfolio').click()
        //upload data file
        cy.get('input.ui-input-file').selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'income_simulation_min.xlsx'), {force: true})
        //input FundName
        cy.get('input[name="FundName"]').type('income simulation test')
        //click create button
        cy.get('[style="margin-top: 20px; margin-left: 2%;"] > .buttonBar').click()
        cy.wait(1000)
        //click download button to download portfolio file and compare
        cy.contains('Download').click()
        copyAndCompareExcel()
        cy.wait(1000)
        //click Analyze button
        cy.contains('Analyze').click()
        //assert create success
        cy.contains('Portfolio calculation is in processing...').should('exist')
        const beginTime = new Date()
        //waiting to download simulation report and compare
        checkReport(beginTime)

        //click OAS Income tab
        cy.get('#tab-second').click()
        cy.contains('Analyze & Download').click({force: true})
        copyAndCompareExcel()

        //upload data file and click analyze button directly
        //upload data file
        cy.get('#pathFileData').selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'income_simulation_min.xlsx'), {force: true})
        //click Analyze button
        cy.contains('Analyze').click()
        //assert create success
        cy.contains('Portfolio calculation is in processing...').should('exist')
        //waiting to download simulation report and compare
        checkReport(beginTime)

    })

    it('Income Simulation->delete fund', () => {
        //click Fund link
        cy.contains(' Fund:').click()
        //assert Fund Management dialog is pop-up
        cy.contains('Fund Management').should('exist')
        //click cycle delete icon
        cy.get('div.popup-win-client[style="padding: 0px 5px; margin-bottom: 10px;"]')
          .contains('income simulation test')
          .parents('td')
          .next()
          .find('i').click()
        //click delete icon to delete whole line
        cy.get('div.popup-win-client[style="padding: 0px 5px; margin-bottom: 10px;"]')
          .contains('income simulation test')
          .parents('td')
          .next().next()
          .find('i').click()
    })

})