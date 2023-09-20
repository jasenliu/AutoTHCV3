import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel, copyAndCompareExcelByGivenFile, waitLoading } from "./utils"

describe('THC Efficient Frontier', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }

        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Optimization Analytics')
        clickLinkByName('THC Efficient Frontier')
        waitLoading(10000)
    })

    it('THC Efficient Frontier', () => {
        // select source drop-down list icon
        cy.get('.thc-center .el-popover__reference-wrapper').eq(0).click()
        //double check all checkbox
        cy.contains('RateSheet').parent().parent().parent().prev().find('input').dblclick({force: true})

        // select Loan Purpose drop-down list icon
        cy.get('.thc-center .el-popover__reference-wrapper').eq(1).click()
        //double check all checkbox
        cy.contains('CashOut').parent().parent().parent().prev().find('input').dblclick({force: true})

        // select Property Type drop-down list icon
        cy.get('.thc-center .el-popover__reference-wrapper').eq(2).click()
        //double check all checkbox
        cy.contains('Unit3_4').parent().parent().parent().prev().find('input').dblclick({force: true})

        // select Occupancy drop-down list icon
        cy.get('.thc-center .el-popover__reference-wrapper').eq(3).click()
        //double check all checkbox
        cy.contains('NoOcc').parent().parent().parent().prev().find('input').dblclick({force: true})
        
        // select Program drop-down list icon
        cy.get('.thc-center .el-popover__reference-wrapper').eq(4).click()
        //double check all checkbox
        cy.contains('FNMADurefiPlus').parent().parent().parent().prev().find('input').dblclick({force: true})

        // select Documentation drop-down list icon
        cy.get('.thc-center .el-popover__reference-wrapper').eq(5).click()
        //double check all checkbox
        cy.contains('Partial').parent().parent().parent().prev().find('input').dblclick({force: true})

        // select Instrument Types drop-down list icon
        cy.get('.thc-center .el-popover__reference-wrapper').eq(6).click()
        //double check all checkbox
        cy.contains('TreasuryBill').parent().parent().parent().prev().find('input').dblclick({force: true})

        // select HiBalance drop-down list icon
        cy.get('.thc-center .el-popover__reference-wrapper').eq(7).click()
        //double check all checkbox
        cy.contains('Yes').parent().parent().parent().prev().find('input').dblclick({force: true})

        //click load button
        cy.get('.el-card__body').contains('Load').click({force: true})
        waitLoading(15000)

        //assert the special strategy name show in the page
        cy.contains('FRM Balloon 10/20').should('exist')

        //click download link
        cy.get('.el-card__body').contains('download').click()
        copyAndCompareExcel()
    })
})