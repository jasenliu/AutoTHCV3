import { login, selectBankByABA, selectBankCycle, clickRiskReportMenuByName, handlePopupboxByID } from './v2-daily-utils'

const v2_daily_username = Cypress.env('v2_daily_username')
const v2_daily_password = Cypress.env('v2_daily_password')
const v2_pro_daily_username = Cypress.env('v2_pro_daily_username')
const v2_pro_daily_password = Cypress.env('v2_pro_daily_password')
describe('v2 daily compare report', () => {
    it('test site create revision and upload pathfile', () => {
        login('https://test.thchf.com.cn/V2/login2.asp', v2_daily_username, v2_daily_password)
        //select bank(QTestBank3)
        selectBankByABA(763)
        //select cycle
        selectBankCycle('Dec 2022')
        //go to generate report page
        clickRiskReportMenuByName('Generate/View Reports')
        cy.wait(25000)
        cy.get('#content').iframe().find('#div-tabs').contains('Revise Reports').click()
        cy.wait(3000)
        handlePopupboxByID('#ipt_createNewDBStrategy', 'confirm')
        cy.wait(2000)
        cy.get('#content').iframe().find('#exlWhatIfFile_sdb').attachFile('State Bank Of Newburg_SmartTool_PathFile202212.xlsx')
        cy.get('#content').iframe().find('#btnUploadDataFile_sdb').click()
        cy.wait(3000)
    })

    it('test site generate report', () => {
        login('https://test.thchf.com.cn/V2/login2.asp', v2_daily_username, v2_daily_password)
        //select bank(QTestBank3)
        selectBankByABA(763)
        //select cycle
        selectBankCycle('Dec 2022')
        //go to generate report page
        clickRiskReportMenuByName('Generate/View Reports')
        cy.wait(10000)
        cy.get('#content').iframe().find('#div-tabs').contains('Revise Reports').click()
        cy.wait(2000)
        //select reports
        cy.get('#content').iframe().find('#cbxRptTpl_14_sdb').should('exist').check() //EVE report
        cy.get('#content').iframe().find('#cbxRptTpl_33_sdb').should('exist').check() //EaE report
        //click generate report
        //handle alert within iframe
        handlePopupboxByID('#btnDataFileGenerateReport_sdb', 'alert')

    })

    it('deploy site create revison and upload pathfile', () => {
        login('https://deploy.thchf.com.cn/V2/login2.asp', v2_daily_username, v2_daily_password)
        //select bank(QTestBank3)
        selectBankByABA(763)
        //select cycle
        selectBankCycle('Dec 2022')
        //go to generate report page
        clickRiskReportMenuByName('Generate/View Reports')
        cy.wait(25000)
        cy.get('#content').iframe().find('#div-tabs').contains('Revise Reports').click()
        cy.wait(3000)
        handlePopupboxByID('#ipt_createNewDBStrategy', 'confirm')
        cy.wait(2000)
        cy.get('#content').iframe().find('#exlWhatIfFile_sdb').attachFile('State Bank Of Newburg_SmartTool_PathFile202212.xlsx')
        cy.get('#content').iframe().find('#btnUploadDataFile_sdb').click({ force: true })
        cy.wait(3000)
    })


    it('deploy site generate reports', () => {
        login('https://deploy.thchf.com.cn/V2/login2.asp', v2_daily_username, v2_daily_password)
        //select bank(QTestBank3)
        selectBankByABA(763)
        //select cycle
        selectBankCycle('Dec 2022')
        //go to generate report page
        clickRiskReportMenuByName('Generate/View Reports')
        cy.wait(10000)
        cy.get('#content').iframe().find('#div-tabs').contains('Revise Reports').click()
        cy.wait(3000)
        //select reports
        cy.get('#content').iframe().find('#cbxRptTpl_14_sdb').should('exist').check() //EVE report
        cy.get('#content').iframe().find('#cbxRptTpl_33_sdb').should('exist').check() //EaE report
        //click generate report
        //handle alert within iframe
        handlePopupboxByID('#btnDataFileGenerateReport_sdb', 'alert')
    })

    it('production site create revision and upload pathfile', () => {
        login('https://v2.thcdecisions.com/V2/login2.asp', v2_pro_daily_username, v2_pro_daily_password)
        //select bank(QTestBank3)
        selectBankByABA(763)
        //select cycle
        selectBankCycle('Dec 2022')
        //go to generate report page
        clickRiskReportMenuByName('Generate/View Reports')
        cy.wait(35000)
        cy.get('#content').iframe().find('#div-tabs').contains('Revise Reports').click()
        cy.wait(2000)
        handlePopupboxByID('#ipt_createNewDBStrategy', 'confirm')
        cy.wait(2000)
        cy.get('#content').iframe().find('#exlWhatIfFile_sdb').attachFile('State Bank Of Newburg_SmartTool_PathFile202212.xlsx')
        cy.wait(2000)
        cy.get('#content').iframe().find('#btnUploadDataFile_sdb').click({ force: true })
        cy.wait(3000)
    })

    it('production site generate reports', () => {
        login('https://v2.thcdecisions.com/V2/login2.asp', v2_pro_daily_username, v2_pro_daily_password)
        //select bank(QTestBank3)
        selectBankByABA(763)
        //select cycle
        selectBankCycle('Dec 2022')
        //go to generate report page
        clickRiskReportMenuByName('Generate/View Reports')
        cy.wait(10000)
        cy.get('#content').iframe().find('#div-tabs').contains('Revise Reports').click()
        cy.wait(1000)
        //select reports
        cy.get('#content').iframe().find('#cbxRptTpl_14_sdb').should('exist').check() //EVE report
        cy.get('#content').iframe().find('#cbxRptTpl_33_sdb').should('exist').check() //EaE report
        //click generate report
        //handle alert within iframe
        handlePopupboxByID('#btnDataFileGenerateReport_sdb', 'alert')
    })

})