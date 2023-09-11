import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel } from "./utils"
describe('Institution Snapshot', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }
        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Performance Insights') 
        cy.get('span[title="Performance Insights"]').eq(1).click() 
        cy.wait(1000)
    })

    it('Performance Insights -> Institution Snapshot', () => {
        //click download button
        cy.get('input[value="download"]').click()
        copyAndCompareExcel()
    })
})