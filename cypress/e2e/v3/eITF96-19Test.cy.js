import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, popConfirm, copyAndCompareExcel, copyAndCompareExcelByGivenFile, waitLoading } from "./utils"

describe('EITF 96-19 Test', () => {

    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }

        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Port Analytics & Reporting')
        clickLinkByName('EITF 96-19 Test')
        waitLoading(10000)
    })

    it('EITF 96-19 Test', () => {
        // click Download button
        cy.contains('Download').click()
        copyAndCompareExcel()

        // select cash option
        cy.get('div.el-card__body select').select('Cash')
        waitLoading(5000)
        cy.contains('Download').click()
        copyAndCompareExcelByGivenFile('EITF_96_19Test_20221231_cash')
    })
})