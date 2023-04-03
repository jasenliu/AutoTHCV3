import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel } from "./utils"
describe('Institution Snapshot', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }
        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Jun 2022')
        clickLinkByName('Performance Insights') 
        clickLinkByName('Institution Snapshot')
        cy.wait(1000)
    })

    it('Institution Snapshot', () => {
        //click download button
        cy.get('input[value="download"]').click()
        copyAndCompareExcel()
    })
})