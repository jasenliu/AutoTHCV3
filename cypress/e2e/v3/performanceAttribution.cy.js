import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel } from "./utils"
const path = require('path')

describe('Performance Attribution', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }
        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Performance Simulation')
        clickLinkByName('Performance Attribution')
        cy.wait(1000)
    })

    it('Performance Attribution -> not upload data file', () => {
        //click generate report button
        cy.contains('Generate Report').click({force: true})
        cy.on('window:alert', (text) => {
            expect(text).to.be.eq('Please upload a file(File1).')
        })
    })

    it('Performance Attribution -> not set date', () => {
        //upload file1
        cy.get('input[name="txtUpload"]').first().selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'loans_bonds_0414_sample.xlsx'), {force: true})
        //upload file2
        cy.get('input[name="txtUpload"]').last().selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'loans_bonds_0421_sample.xlsx'), {force: true})
        //click generate report button
        cy.contains('Generate Report').click({force: true})
        cy.on('window:alert', (text) => {
            expect(text).to.be.eq('Please pick the date(File1)')
        })
    })

    it('Performance Attribution -> generate report/delete', () => {
        const checkReport = (beginTime) => {
            cy.get('body').then(($body) => {
                const endTime = new Date()
                const diffNumber = Number(endTime) - Number(beginTime)
                if (diffNumber > 5 * 60 * 1000) {// more than 5 minutes
                    console.log("Performance Attribution report generate time over.")
                    return
                }
                if ($body.find('[role="progressbar"]').length) {
                    console.log("Performance Attribution report is generating...")
                } else {
                    //download Performance Attribution report and compare
                    cy.contains('04/14/2023 - 04/21/2023').parents('td').next().next().next().find('[title="EXCEL Report"]').click()
                    copyAndCompareExcel()
                    return
                }
                cy.wait(20 * 1000)
                checkReport(beginTime)
            })
        }

        //upload file1
        cy.get('input[name="txtUpload"]').first().selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'loans_bonds_0414_sample.xlsx'), {force: true})
        //upload file2
        cy.get('input[name="txtUpload"]').last().selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'loans_bonds_0421_sample.xlsx'), {force: true})
        // set date1
        cy.get('div.elDate input.el-input__inner').first().type('04/14/2023{enter}', {force: true})
        // set date2
        cy.get('div.elDate input.el-input__inner').last().type('04/21/2023{enter}', {force: true})
        //click generate report button
        cy.contains('Generate Report').click({force: true})
        //assert report generate success
        cy.contains('Generate Successfully.').should('exist')
        //assert report is generating
        cy.contains(' Initializing...').should('exist')
        //download file1 and compare
        cy.contains('04/14/2023 - 04/21/2023').parents('td').next().find('img').click()
        copyAndCompareExcel()
        //download file2 and compare
        cy.contains('04/14/2023 - 04/21/2023').parents('td').next().next().find('img').click()
        copyAndCompareExcel()
        const beginTime = new Date()
        checkReport(beginTime)

        //delete performance report
        cy.contains('04/14/2023 - 04/21/2023').parents('td').prev().then(($td) => {
            const reportId = $td.text().trim()
            cy.log('reportId', reportId)
            //click delete icon
            cy.contains('04/14/2023 - 04/21/2023').parents('td').prev().find('i').click()
            //assert delete success message
            cy.contains('Delete Successfully.').should('exist')
            cy.contains(reportId).should('not.exist')
        })
        //cy.get('table.performance-tbl tbody tr').as('performanceTable')
        /*
        cy.get('@performanceTable').then(($rows) => {
            const before_delete_length = $rows.length
            //click delete icon
            cy.contains('04/14/2023 - 04/21/2023').parents('td').prev().find('i').click()
            //assert delete success message
            cy.contains('Delete Successfully.').should('exist')
            //click refresh icon
            cy.get('[title="refresh"]').click()
            //assert performance report was deleted
            cy.get('@performanceTable').then(($rows) => {
                const after_delete_length = $rows.length
                expect(after_delete_length).to.be.eq(before_delete_length - 1)
            })
        })
        */
    })
})