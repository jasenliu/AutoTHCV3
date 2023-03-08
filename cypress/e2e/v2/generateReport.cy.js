/// <reference types="Cypress" />
import { login, selectBankByABA, selectBankCycle, clickRiskReportMenuByName, handlePopupboxByID, checkReport } from './v2-daily-utils'

const v2_username = Cypress.env('v2_username')
const v2_password = Cypress.env('v2_password')
describe('generate report', () => {
    beforeEach(() => {
        login('https://test.thchf.com.cn/V2/login2.asp', v2_username, v2_password)
        //select bank(QTestBank3)
        selectBankByABA(91913685)
        //select cycle
        selectBankCycle('Dec 2022')
        //go to generate report page
        clickRiskReportMenuByName('Generate/View Reports')
        cy.wait(5000)
    })

    it('upload file', () => {
        cy.get('#content').iframe().find('#selTypeReport').select('path+')
        cy.get('#content').iframe().find('#etlPATHPlus').attachFile('data/PATH-sample-Whole_Loan_file_min.xlsx')
        cy.get('#content').iframe().find('#btnUploadDataFile').click()
        cy.wait(2000)
    })

    it('generate repots', () => {
        cy.get('#content').iframe().find('#cbxRptTpl_140').check()
        cy.get('#content').iframe().find('#cbxRptTpl_330').check()

        //cy.get('#content').iframe().find('#btnDataFileGenerateReport').click()
        handlePopupboxByID('#btnDataFileGenerateReport', 'confirm')

        cy.get('iframe').then(($iframe) => { //will get total 6 iframes
            const $body = $iframe.contents().find('body')[4] //the 4th iframe is needed
            const $win = $iframe[4].contentWindow
            cy.stub($win, 'alert').as('windowAlert')
        })

    })

    it('check report progress', () => {
        const checkAndCompareReport = (reportList, beginTime) => {
            cy.get('#content').then(() => {
                const endTime = new Date()
                const diffNumber = Number(endTime) - Number(beginTime)
                if (diffNumber > 30 * 60 * 1000 || reportList[2] === undefined) {
                    console.log('time over!')
                    return
                }
                checkReport(reportList)
                cy.wait(2 * 60 * 1000) //wait 2 minutes
                checkAndCompareReport(reportList, beginTime)

            })
        }

        /* below were iframe id 
        eve: #ReportProgress14
        krd: #ReportProgress18
        ear: #ReportProgress33
        gap: #ReportProgress29_1
        cash flow: #ReportProgress34_1
        loan portfolio analytics: #ReportProgress96
        assumption: #ReportProgress108
        DD: #ReportProgress119
        two cycle: #ReportProgress107
        management summary: #ReportProgress120
        */

       const reportList = ['#ReportProgress14', '#ReportProgress29_1', '#ReportProgress33']
       const beginTime = new Date()
       checkAndCompareReport(reportList, beginTime)
       //checkReport(reportList)


    })
})