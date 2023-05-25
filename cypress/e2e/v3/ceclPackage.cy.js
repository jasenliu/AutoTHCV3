import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel, copyAndCompareExcelByGivenFile, waitLoading } from "./utils"

describe('CECL Package', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }

        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Risk Analytics & Reporting')
        clickLinkByName('CECL Package')
        waitLoading(5000)
    })

    it('CECL Package', () => {
        // click Generate CECL Package Report button
        cy.get('input[value="Generate CECL Package Report"]').click()
        copyAndCompareExcel()

        // check PD LGD checkbox
        cy.get('div.el-card__body input[type="checkbox"]').check()
        cy.get('input[value="Generate CECL Package Report"]').click()
        copyAndCompareExcelByGivenFile('CECLPackage_pdlgd')
    })
})