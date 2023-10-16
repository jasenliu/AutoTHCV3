import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel, waitLoading } from "./utils"
const path = require('path')

describe('Financial Simulation', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }
        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Performance Simulation')
        clickLinkByName('Financial Simulation')
        cy.wait(1000)
    })

    it('financial simulation->create budgeting directly and then delete', () => {
        //click Create/Open Budget tab
        cy.contains('Create/Open Budget').click()
        waitLoading(20000)
        //click simulation radio button
        cy.get('span.circleFun8').click()
        //click simulate button
        cy.get('#BudSimulate').click()
        //assert processing message
        cy.contains('budgeting simulation is in processing...').should('exist')
        cy.wait(1000)
        // wait for processing message disappear
        cy.get('div[role="progressbar"]', {timeout: 30000}).should('not.be.visible')
        //from column Assets to column Tier1 in the Dashboard
        const bench_new_simulation = ['240,512', '195,991', '31,784', '173,852', '59,302', '24.66', '4.76', '8,109', '2,084', '3,572', '3.49', '1.49', '6.02', '46,097', '', '1.33', '112.73', '2.47', '']
        cy.get('table.lcentral[style="width: 100%;"] tbody tr').as('simulationsTable')
        let financial_simulation_id = ""
        cy.get('@simulationsTable').then(($rows) => {
            let first_row = ''
            $rows.each((index, $row) => {
                //new added financial simulation was the thrid line
                if (index == 2) {
                    first_row = Cypress._.map($row.children, 'innerText')
                    cy.log('row:', first_row)
                    financial_simulation_id = first_row[2]
                    cy.log('financialSimulationId', financial_simulation_id)
                    expect(first_row.slice(5, 24)).to.deep.eq(bench_new_simulation)
                    //click delete icon
                    cy.get('@simulationsTable').eq(2).find('i').click()
                    cy.contains(financial_simulation_id).should('not.exist')
                }
            })
        })

        //delete the financial simulation
        //click Refresh link
        /*
        cy.contains('Refresh').click()
        cy.get('@simulationsTable').then(($rows) => {
            const before_delete_length = $rows.length
            //click delete icon
            cy.get('@simulationsTable').eq(2).find('i').click()
            //click Refresh link
            cy.contains('Refresh').click()
            //assert the financial simulation was deleted
            cy.get('@simulationsTable').then(($rows) => {
                const after_delete_length = $rows.length
                expect(after_delete_length).to.eq(before_delete_length - 1)
            })
        })
        */
    })

    it('finance simulation-> upload budgeting file then simulation', () => {
        //click Create/Open Budget tab
        cy.contains('Create/Open Budget').click()
        waitLoading(20000)
        //click download input file button
        cy.get('input[value="Download input File"]').click()
        copyAndCompareExcel()
        //upload budgeting file
        cy.get('#file').selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'BudgetingInput(0).xlsx'), {force: true})
        //click upload button
        cy.get('input[value="Upload"]').click()
        waitLoading(10000)
        //assert upload success
        cy.contains('Upload successful!').should('exist')

        //click simulation radio button
        cy.get('span.circleFun8').click()
        //click simulate button
        cy.get('#BudSimulate').click()
        //assert processing message disappear
        cy.contains('budgeting simulation is in processing...').should('exist')
        cy.wait(1000)
        // wait for processing message disappear
        cy.get('div[role="progressbar"]', {timeout: 30000}).should('not.be.visible')
        //from column Assets to column Tier1 in the Dashboard
        const bench_new_simulation = ['240,512', '195,991', '31,784', '173,852', '59,302', '24.66', '4.76', '8,109', '2,084', '3,572', '3.49', '1.49', '6.02', '46,097', '', '1.33', '112.73', '2.47', '']
        cy.get('table.lcentral[style="width: 100%;"] tbody tr').as('simulationsTable')
        cy.get('@simulationsTable').then(($rows) => {
            let first_row = ''
            $rows.each((index, $row) => {
                //new added financial simulation was the thrid line
                if (index == 2) {
                    first_row = Cypress._.map($row.children, 'innerText')
                    cy.log('row:', first_row)
                    expect(first_row.slice(5, 24)).to.deep.eq(bench_new_simulation)
                }
            })
        })
        //click delete icon
        cy.get('@simulationsTable').eq(2).find('i').click()
    })
})