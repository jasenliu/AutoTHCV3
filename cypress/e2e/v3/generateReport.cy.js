const path = require('path')
import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, popAlert, copyAndCompareExcel, getReportNameBySpanID,
checkReport } from './utils'


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

    it('QTestBank3 generate report', () => {

        //choose file type PATH+
        cy.get('._tabbody').find('select').select('PATH+', { force: true })

        //upload file
        cy.get('[name="PATHPlus"]').selectFile(`${dataPath}/State_Bank_Of_Newburg(202206)_PathFile_min.xlsx`)
        cy.get('[name="btnUploadDataFile"]').click()

        //select report
        //cy.get('#Interest\u00a0Risk')
        cy.get('#cbxRpt_00').check()
        cy.get('#cbxRpt_02').check()

        //click generate report button
        cy.get('[value="Generate Report"]').click()
        popAlert()

        cy.get('.inline').eq(0).should('exist')

    })

    it.only('check report progress' , () => {

        const checkAndCompareReport = (reportList, beginTime) => {
            cy.get('.topline').then(() => {
                const endTime = new Date()
                const diffNumber = Number(endTime) - Number(beginTime)
                if (diffNumber > 1800 * 1000 || reportList[9] === undefined) {
                    console.log('time over!')
                    return
                }
                checkReport(reportList)
                cy.wait(2 * 60 * 1000) //wait 2 minutes
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
}) 