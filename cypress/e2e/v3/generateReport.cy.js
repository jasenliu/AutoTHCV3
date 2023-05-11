const path = require('path')
import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, popAlert, copyAndCompareExcel, getReportNameBySpanID,
checkReport, waitLoading} from './utils'


const fixturesFolder = Cypress.config('fixturesFolder')
const downloadsFolder = Cypress.config('downloadsFolder')
const benchmarkPath = path.join(fixturesFolder.replace(/\\/g, '/'), 'report/benchmark_report/smart_tool')
const generatePath = path.join(fixturesFolder.replace(/\\/g, '/'), 'report/generate_report')
const diffPath = path.join(fixturesFolder.replace(/\\/g, '/'), 'result')
const dataPath = path.join(fixturesFolder.replace(/\\/g, '/'), 'data')

describe('generate report', () => {

    beforeEach(() => {

        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }

        //go to Generate/View Reports page
        clickLinkByName('Port Analytics & Reporting')
        clickLinkByName('Generate/View Reports')

        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Jun 2022')
    })

    it('Generate Monthly/Quarterly Reports -> Generate report', () => {

        //choose file type PATH+
        cy.get('._tabbody').find('select').select('PATH+', { force: true })

        //upload file
        cy.get('[name="PATHPlus"]').selectFile(`${dataPath}/State_Bank_Of_Newburg(202206)_PathFile_min.xlsx`)
        cy.get('[name="btnUploadDataFile"]').click()

        // select repors to generate
        //cy.get('#Interest\u00a0Risk')
        cy.get('#cbxRpt_00').check() // EvE
        cy.get('#cbxRpt_01').check() // KRD
        cy.get('#cbxRpt_02').check() // EaR
        cy.get('#cbxRpt_10').check() // Liquidity Gap
        cy.get('#cbxRpt_27').check() // Loan Portfolio Analytics
        cy.get('#cbxRpt_213').check() // Assumption Report
        cy.get('#cbxRpt_215').check() // Two Cycles Comparison

        //click generate report button
        cy.get('[value="Generate Report"]').click()
        popAlert()

        cy.get('.el-progress-bar__outer').eq(0).should('exist')

    })

    it.skip('Generate Monthly/Quarterly Reports -> Check report progress and compare report' , () => {

        const checkAndCompareReport = (reportList, beginTime) => {
            cy.get('.topline').then(() => {
                const endTime = new Date()
                const diffNumber = Number(endTime) - Number(beginTime)
                // more than 30 minutes or reportList is empty
                if (diffNumber > 1800 * 1000 || reportList[9] == undefined) {
                    console.log('time over!')
                    return
                }
                checkReport(reportList)
                //cy.wait(2 * 60 * 1000) //wait 2 minutes
                checkAndCompareReport(reportList, beginTime)

            })
        }

        /*
        eve: #download-0-1
        krd: #download-0-6
        ear: #download-0-2
        gap: #download-0-104
        cash flow: #download-0-3
        loan portfolio analytics: #download-0-15
        assumption: #download-0-22
        DD: #download-0-23
        two cycle: #download-0-28
        management summary: #download-0-24
        */

        const reportList = ['#download-0-1', '#download-0-6', '#download-0-2', '#download-0-104', '#download-0-3', '#download-0-15',
        '#download-0-22', '#download-0-23', '#download-0-28', '#download-0-24']
        const beginTime = new Date()

        checkAndCompareReport(reportList, beginTime)
        
    })

    it('Revise Reports-> Generate Report', () => {
        
        // click Revise Reports tab
        cy.contains('Revise Reports').click()
        waitLoading(10000)
        // click Create Revision buton
        cy.get('input[value="Create Revision"]').click()
        waitLoading(10000)
        // upload data file
        cy.get('input[name="exlWhatIfFile_sdb"]').selectFile(`${dataPath}/State_Bank_Of_Newburg(202206)_PathFile_min.xlsx`, {force: true})
        // click upload button
        cy.get('input[name="btnUploadDataFile_sdb"]').click()
        waitLoading(10000)
        // select repors to generate
        cy.get('#cbxRpt_00').check() // EvE
        cy.get('#cbxRpt_01').check() // KRD
        cy.get('#cbxRpt_02').check() // EaR
        cy.get('#cbxRpt_10').check() // Liquidity Gap
        cy.get('#cbxRpt_27').check() // Loan Portfolio Analytics
        cy.get('#cbxRpt_213').check() // Assumption Report
        cy.get('#cbxRpt_215').check() // Two Cycles Comparison

        // click Generate Report button
        cy.get('input[value="Generate Report"]').click()
        waitLoading(15000)
        // assert report progress bar show in the page
        cy.get('.el-progress-bar__outer').eq(0).should('exist')

    })

    it.skip('Revise Reports-> Check Report progress and compare report', () => {
        const checkAndCompareReport = (reportList, beginTime) => {
            cy.get('div.el-card__body').then(() => {
                const endTime = new Date()
                const diffNumber = Number(endTime) - Number(beginTime)
                // more than 30 minutes or reportList is empty
                if (diffNumber > 1800 * 1000 || reportList[9] == undefined) {
                    console.log('time over!')
                    return
                }
                checkReport(reportList)
                //cy.wait(2 * 60 * 1000) //wait 2 minutes
                checkAndCompareReport(reportList, beginTime)

            })
        }
        const reportList = ['#download-0-1', '#download-0-6', '#download-0-2', '#download-0-104', '#download-0-3', '#download-0-15',
        '#download-0-22', '#download-0-23', '#download-0-28', '#download-0-24']
        const beginTime = new Date()

        checkAndCompareReport(reportList, beginTime)

    })
}) 