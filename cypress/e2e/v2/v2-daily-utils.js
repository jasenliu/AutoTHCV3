import { copyAndCompareExcel } from "../v3/utils"

export const login = (url, username, password) => {
    cy.visit(`${url}`)
    //cy.get('#menu-item-181').should('exist').click()
    cy.get('#rm_login_form_1-element-2').should('exist').type(`${username}`)
    cy.get('#rm_login_form_1-element-3').should('exist').type(`${password}`)
    cy.get('#rm_submit_btn').should('exist').click()
}

export const selectBankByABA = (abaNumber) => {
    cy.get('#newTHC_selectBank').should('exist').click()
    cy.wait(3000)
    cy.get('#txtMTClientContainerFrameABANumber').should('exist').type(`${abaNumber}`)
    cy.get('#txtMTClientContainerFrameSearch').should('exist').click()
    cy.wait(3 * 1000)
    cy.contains(`${abaNumber}`).should('exist').click()
    cy.get('#newTHC_selectBankGEO').should('be.visible')
}

export const selectBankCycle = (bankCycle) => {
    cy.wait(1000)
    cy.get('#newTHC_selectCycle').should('exist').click()
    cy.wait(3000)
    cy.contains(`${bankCycle}`).should('exist').click()
    cy.wait(3000)
}

export const clickRiskReportMenuByName = (menuName) => {
    cy.get('[sign="1008"]').should('exist').click() //ASSET LIABILITY MANAGEMENT->Risk Reports
    cy.contains('Risk Reports').should('exist').click()
    cy.contains(`${menuName}`).click()
}

export const handlePopupboxByID = (buttonID, alertOrConfirm) => {
    cy.get('iframe').then(($iframe) => { //will get total 6 iframes
        const $body = $iframe.contents().find('body')[4] //the 4th iframe is needed
        const $win = $iframe[4].contentWindow
        if (alertOrConfirm === 'alert') {
            cy.stub($win, 'alert').as('windowAlert')
        } else {
            cy.stub($win, 'confirm', () => true).as('windowConfirm')
        }
        cy.wrap($body).find(`${buttonID}`).click({ force: true })
    })
}

export const getReportNameByIFrameID = (iframeId) => {
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
   switch(iframeId) {
       case '#ReportProgress14':
           return 'EVE Report'
           break
       case '#ReportProgress18':
           return 'KRD Report'
           break
       case '#ReportProgress33':
           return 'EaR Report'
           break
       case '#ReportProgress29_1':
           return 'Gap Report'
           break
       case '#ReportProgress34_1':
           return 'Cahflow Report'
           break
       case '#ReportProgress96':
           return 'Loan portfolio Analytics Report'
           break
       case '#ReportProgress108':
           return 'Assumption Report'
           break
       case '#ReportProgress119':
           return 'DD Report'
           break
       case '#ReportProgress107':
           return 'Two Cycle Report'
           break
       case '#ReportProgress120':
           return 'Management Summary Report'
   }
}

export const checkReport = (reportList) => {
    reportList.forEach((iframeId, index, list) => {
        console.log(iframeId)
        cy.get('#content').iframe().find(iframeId).then(($iframe) => {
            const progress = $iframe.contents().find('#divprogress0').length
            if (progress) {
                console.log(`${getReportNameByIFrameID(iframeId)} is generateing...`)
            } else {
                //cy.get('#content').iframe().find(iframeId).iframe().find('#rpt_excel').click()
                $iframe.contents().find('#rpt_excel').click()
                cy.wait(5000)
                delete reportList[index]
                copyAndCompareExcel()
            }
        })
        cy.wait(3000)
    })
}