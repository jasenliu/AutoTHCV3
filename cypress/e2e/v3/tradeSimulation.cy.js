import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel, copyAndCompareExcelByGivenFile, waitLoading } from "./utils"
const { faker } = require("@faker-js/faker")

describe('Trade Simulation', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }

        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Optimization Analytics')
        clickLinkByName('Trade Simulation')
        waitLoading(10000)
    })

    it('Trade Simulation -> Create/Edit Simulation' ,() => {
        waitLoading(60000)
        // click add button directly
        cy.contains('Choose Sources').next().click()
        cy.on('window:alert', (text) => {
            expect(text).to.be.eq('Please choose at least one security to add!')
        })
        cy.get('.ag-center-cols-container', {timeout: 60000}).should('be.visible')
        // check treasury header checkbox 
        cy.get('.header-checkbox').click() //9 item
        // click add button
        cy.contains('Choose Sources').next().click()
        cy.wait(2000)
        // click Brokered Deposits tab
        cy.contains('Brokered Deposits').click()
        waitLoading(20000)
        cy.contains('Retail CD 5yr', {timeout: 60000}).should('be.visible')
        //cy.get('.ag-center-cols-viewport', {timeout: 10000}).should('be.visible')
        // check Brokered Deposits header checkbox 
        cy.get('.header-checkbox').click() //21 item
        // click add button
        cy.contains('Choose Sources').next().click()
        // click simulate button
        cy.contains('Remove').next().click()
        waitLoading(120000)
        cy.get('.el-message-box__message p').then(($p) => {
            const text = $p.text()
            // get tradeId from pop-up dialog
            const tradeId = text.match(/\d+/)[0]
            // assert tradeId exists in the page
            cy.contains(tradeId).should('exist')
            // click OK button
            cy.get('.el-button').click()

            // click Desc link
            cy.log(tradeId)
            cy.contains(tradeId).parent().next().find('a').click()
            const fakerDesc = faker.random.words()
            // input desc
            cy.get('.popup-win-client textarea').type(fakerDesc)
            // click save button
            cy.get('input[value="Save"]').click()
            waitLoading(5000)
            cy.contains(fakerDesc).should('exist')

            // click send to expert strategy list icon
            cy.contains(tradeId).parent().prev().prev().find('img[title="Send to Expert Strategy List"]').click()
            waitLoading(120000)
            cy.get('.el-message-box__message p p').then(($p) => {
                const text = $p.text()
                // get expertId from pop-up dialog
                const expertId = text.match(/\d+/)[0]
                // click Expert System link
                cy.get('.el-message-box__message p p a').click()
                waitLoading(120000)
                // assert expertId display in the strategy manager page
                cy.contains(expertId).should('exist')
                // close strategy manager app
                cy.get('.tabs-content').contains('Strategy Manager').find('span').click()
                waitLoading(120000)
                waitLoading(120000)

                // click submit the strategt icon
                cy.contains(tradeId).parent().prev().prev().find('img[title="Submit the strategy, use hivemind for further negotiations"]').click()
                // click submit button
                cy.get('#sendhivemind').parent().prev().click()
                // assert submit success
                cy.contains('Submit Successfully.').should('exist')

                // click copy the strategy icon
                cy.contains(tradeId).parent().prev().prev().find('i').click()
                // input bank name
                cy.get('input[name="Bank Name"]').type('qtest')
                cy.contains('Search').click()
                // select the first bank in the list
                cy.get('input[name="clientSelected"]').eq(0).check()
                // click copy button
                cy.get('input[value="Copy"]').click()
                waitLoading(120000)
                // assert copy success
                cy.contains('Save Successfully.').should('exist')

                // click Copy & Submit the strategy icon
                cy.contains(tradeId).parent().prev().prev().find('i').click()
                // input bank name
                cy.get('input[name="Bank Name"]').type('qtest')
                cy.contains('Search').click()
                // select the first bank in the list
                cy.get('input[name="clientSelected"]').eq(0).check()
                // click Copy & Submit button
                cy.get('input[value="Copy & Submit"]').click()
                waitLoading(120000)
                // assert copy success
                cy.contains('Save Successfully.').should('exist')

                //select current simulation to edit
                cy.contains(tradeId).click()
                // select one item in the buy basket
                cy.get('.trade-basket-side .ag-cell .ag-checkbox-input').eq(0).check()
                // select one item in the funding basket
                cy.get('.trade-basket-side').eq(1).find('.ag-cell .ag-checkbox-input').eq(0).check() 
                // click remove button
                cy.contains('Remove').click()
                // assert the items were removed
                cy.contains('Total(8)').should('exist') //BUY BASKET number
                cy.contains('Total(20)').should('exist') //FUNDING BASKET number
                // click update button
                cy.contains('Remove').next().next().click()
                waitLoading(120000)
                // assert edit success 
                cy.contains('edit successfully.').should('exist')
                // click OK button
                cy.get('.el-button').click()

                // select current trade simulation
                cy.contains(tradeId).click()
                // click BOND SWAP ANALYSIS button
                cy.contains('BOND SWAP ANALYSIS').click()
                waitLoading(60000)
                // assert BOND SWAP ANALYSIS page opened
                cy.contains('INVESTMENT PORTFOLIO STATISTICS').should('exist')
                // download Bond Swap Analysis report
                cy.contains('Download').click()
                copyAndCompareExcel()
                // close BOND SWAP ANALYSIS page
                cy.get('.popup-win-close').eq(1).find('i').click({force: true})

                // delete trade simulation
                // click delete icon 
                cy.contains(tradeId).parent().prev().prev().find('img[title="delete"]').click()
                // assert trade simulation deleted
                cy.contains(tradeId).should('not.be.visible')

            })
        })

        
    })

    it('Trade Simulation -> Generate/View Reports -> SIMULATION ANALYSIS', () => {
        const checkReport = (beginTime) => {
            cy.get('body').then(($body) => {
                const endTime = new Date()
                const diffNumber = Number(endTime) - Number(beginTime)
                if (diffNumber > 5 * 60 * 1000) {// more than 5 minutes
                    console.log("trade simulation report generate time over.")
                    return
                }
                if ($body.find('[role="progressbar"]').length) {
                    console.log("trade simulation report is generating...")
                } else {
                    //download EVE reort and compare
                    cy.get('div.generate-view table table tr').eq(0).find('img[title="EXCEL"]').click()
                    copyAndCompareExcelByGivenFile('QTestBank3(20221231)-Revision(trade)-EVE')
                    return
                }
                cy.wait(20 * 1000)
                checkReport(beginTime)
            })
        }

        // select special simulation with desc "autotest_not_delete"
        cy.contains('autotest_not_delete').parent().parent().prev().click()
        waitLoading(10000)
        // click Generate/View Reports tab
        cy.get('.TabClassify').contains('Generate/View Reports').click({force: true})
        waitLoading(10000)
        // click SIMULATION ANALYSIS tab
        cy.contains('SIMULATION ANALYSIS').click()
        waitLoading(5000)
        // check EVE report
        cy.get('#cbxRpt_00').check()
        // click generate report button
        cy.get('input[value="Generate Report"]').click()
        // assert progress bar show in page
        cy.contains('Calculating...', {timeout: 60000}).should('be.visible')
        const beginTime = new Date()
        checkReport(beginTime)

    })

    it('Trade Simulation -> Generate/View Reports -> TRADE REPORTS SWAP ANALYSIS', () => {
        const checkReport = (beginTime) => {
            cy.get('body').then(($body) => {
                const endTime = new Date()
                const diffNumber = Number(endTime) - Number(beginTime)
                if (diffNumber > 5 * 60 * 1000) {// more than 5 minutes
                    console.log("trade simulation report generate time over.")
                    return
                }
                if ($body.find('[style="width: 200px; background-color: rgb(220, 220, 220); vertical-align: middle;"]').length) {
                    console.log("trade simulation report is generating...")
                } else {
                    //download BOND SWAP REPORT and compare
                    cy.contains('BOND SWAP REPORT').parent().next().find('img').click()
                    copyAndCompareExcelByGivenFile('BondSwapReport')
                    // download Income Attribution Report and compare
                    cy.contains('IncomeRisk Report').prev().click()
                    copyAndCompareExcelByGivenFile('IncomeAttribution')
                    // download IncomeRisk Report and compare
                    cy.contains('IncomeRisk Report').click()
                    copyAndCompareExcelByGivenFile('IncomeRiskReport')
                    return
                }
                cy.wait(20 * 1000)
                checkReport(beginTime)
            })
        }

        // select special simulation with desc "autotest_not_delete"
        cy.contains('autotest_not_delete').parent().parent().prev().click()
        waitLoading(10000)
        // click Generate/View Reports tab
        cy.get('.TabClassify').contains('Generate/View Reports').click({force: true})
        waitLoading(10000)
        // click TRADE REPORTS SWAP ANALYSIS tab
        cy.contains('TRADE REPORTS SWAP ANALYSIS').click()
        waitLoading(5000)

        // download pre-trade report
        cy.contains('PRE TRADE REPORT').parent().next().click()
        copyAndCompareExcel()
        // click BOND SWAP REPORT generate button 
        cy.contains('Include Cash').find('input[type="button"]').click()
        // assert success info
        cy.contains('Generate Successfully.').should('exist')
        // click INCOME ATTRIBUTION REPORT generate button
        cy.contains('Previous Valuation Date:').parent().next().find('input[type="button"]').click()
        // assert success info
        cy.contains('Generate Successfully.').should('exist')
       const beginTime = new Date()
       checkReport(beginTime)
    })

    it('Trade Simulation -> Tools', () => {
        // select special simulation with desc "autotest_not_delete"
        cy.contains('autotest_not_delete').parent().parent().prev().click()
        waitLoading(10000)
        // click Tools tab
        cy.get('.TabClassify').contains('Tools').click({force: true})
        waitLoading(10000)
        cy.contains('Download Trade File').click()
        copyAndCompareExcelByGivenFile('tradeSimulationStrategyFile')
    })
})