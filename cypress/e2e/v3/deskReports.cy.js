import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel, waitLoading } from "./utils"
const path = require('path')
const { faker } = require("@faker-js/faker")

describe('Desk Reports', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }
        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Port Analytics & Reporting')
        clickLinkByName('Desk Reports')
        cy.wait(1000)
    })

    it('Desk Reports-> Generate Report by Cycle/delete', () => {
        const checkReport = (beginTime) => {
            cy.get('body').then(($body) => {
                const endTime = new Date()
                const diffNumber = Number(endTime) - Number(beginTime)
                if (diffNumber > 5 * 60 * 1000) {// more than 5 minutes
                    console.log("Desk report generate time over.")
                    return
                }
                if ($body.find('[role="progressbar"]').length) {
                    console.log("Desk report is generating...")
                } else {
                    //download Loan Performance reort and compare
                    cy.get('table.lcentral_bid tbody tr').eq(0).children().eq(16).find('img').click()
                    copyAndCompareExcel()
                    cy.wait(2000)
                    //download Decrement Cashflow reort and compare
                    cy.get('table.lcentral_bid tbody tr').eq(0).children().eq(17).find('img').click()
                    copyAndCompareExcel()
                    cy.wait(2000)
                    //download Loan Cashflow reort and compare
                    cy.get('table.lcentral_bid tbody tr').eq(0).children().eq(18).find('img').click()
                    copyAndCompareExcel()
                    cy.wait(2000)
                    //download Lambda reort and compare
                    cy.get('table.lcentral_bid tbody tr').eq(0).children().eq(20).find('img').click()
                    copyAndCompareExcel()
                    cy.wait(2000)
                    //download source file and compare
                    cy.get('table.lcentral_bid tbody tr').eq(0).children().eq(21).find('a').click()
                    copyAndCompareExcel()
                    cy.wait(1000)
                    return
                }
                cy.wait(20 * 1000)
                checkReport(beginTime)
            })
        }

        waitLoading(10000)
        // upload loan file
        cy.get('input[name="loanFile"]').selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'PATH-sample-Whole_Loan_file_min.xlsx'), {force: true})
        // click Generate Reports button
        cy.get('input[value="Generate Reports"]').click()
        waitLoading(10000)
        //assert report generated successfully 
        cy.contains('Calculating',{timeout: 90000}).should('exist')
        const fakerDescription = faker.random.words()
        // click Edit link
        cy.get('table.lcentral_bid tbody tr').eq(0).children().eq(2).click()
        // input description
        cy.get('#divpopDescInner textarea').type(fakerDescription)
        // click save button
        cy.get('input[value="Save"]').click()
        // assert description saved successfully
        cy.contains(fakerDescription).should('exist')
        const beginTime = new Date()
        checkReport(beginTime)

        // click view link to open View Analytics page
        cy.get('table.lcentral_bid tbody tr').eq(0).children().eq(0).find('a').click()
        waitLoading(10000)
        cy.wait(5000)
        waitLoading(10000)
        let summary_bench = ['Summary', '', '300,000', '3.625', '1y libor', '', '38', '3.625', '3.245', '258', '', '', '', '', '', '', '', '98.855', '97.764', '1.092', '-0.740', '2.253', '1.661', '2.621', '104.650', '6.127', '38', '4.019', '-0.255', '0.811', '0.597', '0.954', '770', '75.000', '0.973', '-10.762', '0.548', '2.253', '2.568', '32.843', '1.354', '-0.196', '16.569', '18.383', '3.405', '2.876']
        let summary_temp = []
        // get summary info from table
        cy.get('div[name="center"] div.ag-center-cols-container div.ag-cell-value').then(($divs) => {
            $divs.each((index, $div) => {
                summary_temp.push($div.innerText)
            })
            cy.log(summary_temp)
            // assert summary info
            expect(summary_temp).to.deep.equal(summary_bench)
        })
        // click return icon
        cy.get('img[alt="return.png"]').click()
        waitLoading(10000)

        // delete desk report
        cy.get('table.lcentral_bid tbody tr').eq(0).children().eq(1).then(($td) => {
            const deskReportId = $td.text().trim()
            cy.log(deskReportId)
            //click delete icon
            cy.get('table.lcentral_bid tbody tr').eq(0).children().last().find('i').click()
            // assert the desk reporst deleted successfully
            cy.contains(deskReportId).should('not.exist')
        })
    })
     it('Desk Reports-> Generate Report by Evaluation Date/delete', () => {
        waitLoading(10000)
        // check Evaluation Date radio button
        cy.get('input[value="EvaluationDate"]').check()
        // upload loan file
        cy.get('input[name="loanFile"]').selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'PATH-sample-Whole_Loan_file_min.xlsx'), {force: true})
        // click Generate Reports button
        cy.get('input[value="Generate Reports"]').click()
        waitLoading(10000)
        //assert report generated successfully 
        cy.contains('Calculating',{timeout: 90000}).should('exist')
        // delete desktop report
        cy.get('table.lcentral_bid tbody tr').eq(0).children().last().find('i').click()
     })
})