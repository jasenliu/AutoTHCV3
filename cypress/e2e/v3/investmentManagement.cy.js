import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel, waitLoading } from "./utils"
const path = require('path')

describe('Investment Management', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }
        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Port Analytics & Reporting')
        clickLinkByName('Investment Management')
        cy.wait(1000)
    })

    it('Investment Management -> Securities', () => {
        waitLoading(20000)
        //get cell data from table
        const treasury_bench = ['', '', 'Note', '912828Z52', 'US TREASURY N/B', '01/31/2025', '1.38', '2.01', '1.13', '4.38', '94.06', '12/31/2022']
        cy.get('div.el-card__body table.lcentral tbody tr').then(($rows) => {
            $rows.each((index, $row) => {
                const cells = Cypress._.map($row.children, 'innerText')
                cy.log(cells)
                expect(cells).to.deep.equal(treasury_bench)
            })
        })

        // double click the line according cusip
        cy.contains('912828Z52').dblclick()
        waitLoading(10000)
        //click excel icon to download single security analysis report
        cy.get('div.loading img').click()
        copyAndCompareExcel()

        //close security analysis pop up page
        cy.get('div.el-card__body div.popup-win-close i.el-icon-close').click({force: true})
    })

    it('Investment Management -> Investment Performance Report', () => {
        waitLoading(20000)
        // click Investment Performance Report tab
        cy.contains('Investment Performance Report').click()
        waitLoading(20000)
        const currentValue = []
        const overview_bench = ['34,094', '31,784', '34,094', '1.89', '3.14', '3.97', '4.67', '1.48', '1.71', '2.70', '13,424', '-2,310', '-6.78']
        //get cell data from table
        cy.get('table.portfolio-tbl tbody tr').then(($rows) => {
            $rows.each((index, $row) => {
                // the current value in the second td
                const cells = $row.children[1].innerText
                //cy.log(cells)
                currentValue.push(cells)
            })
            //cy.log(currentValue)
            expect(currentValue).to.deep.equal(overview_bench)
        })

        //click excel icon to download Portfolio Performance Report
        cy.get('div.el-card__body img').click()
        copyAndCompareExcel()
    })

    it('Investment Management -> Performance Attribution', () => {
        waitLoading(20000)
        //click Performance Attribution tab
        cy.get('div.el-card__body').contains('Performance Attribution').click()
        waitLoading(20000)
        const performanceAttribution_bench = ['', '12/31/2022', '09/30/2022 - 12/31/2022', '3,148,985', '1.146%', '0.832%', '0.014%', '0.000%', '0.000%', '0.170%', '-0.582%', '-0.116%', '0.586%', '-0.000%', '0.237%', '-0.018%', '0.000%', '0.000%', '0.023%', '']
        //get cell data from table
        cy.get('div.el-card__body table tbody tr').then(($rows) => {
            $rows.each((index, $row) => {
                const cells = Cypress._.map($row.children, 'innerText')
                //cy.log(cells)
                expect(cells).to.deep.equal(performanceAttribution_bench)
            })
        })
        //click excel icon to download Performance Attribution Report
        cy.get('img[title="EXCEL Report"]').click()
        copyAndCompareExcel()
    })
})