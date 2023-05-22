import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, popConfirm, copyAndCompareExcel, copyAndCompareExcelByGivenFile, waitLoading } from "./utils"

describe('CECL Analytics', () => {

    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }

        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Risk Analytics & Reporting')
        clickLinkByName('CECL Analytics')
        waitLoading(10000)
    })

    it('CECL Analytics -> input gross loss rate/recovery rate', () => {
        cy.contains('* Those scenarios are pre-set by THC.').should('be.visible')
        // Loan CECL Analytics table part
        // input Gross Loss Rate and Recovery Rate in summary line
        cy.get('div.el-table').eq(0).find('table tr').eq(0).as('loanCeclAnalyticsInputRow')
        cy.get('@loanCeclAnalyticsInputRow').find('input[name="GrossLossRate"]').clear()
        cy.get('@loanCeclAnalyticsInputRow').find('input[name="GrossLossRate"]').type('3{enter}')
        cy.get('@loanCeclAnalyticsInputRow').find('input[name="RecoveryRatio"]').clear()
        cy.get('@loanCeclAnalyticsInputRow').find('input[name="RecoveryRatio"]').type('80{enter}')

        // assert Net Loss Rate, CECL(&000) and CECL(%) in summary line
        cy.get('div.el-table').eq(0).find('table tr').eq(0).children().eq(1).find('table tr').children().as('loanCeclAnalyticsAssertRow')
        cy.get('@loanCeclAnalyticsAssertRow').eq(6).should('have.text', '0.60')
        cy.get('@loanCeclAnalyticsAssertRow').eq(7).should('have.text', '3,392')
        cy.get('@loanCeclAnalyticsAssertRow').eq(8).should('have.text', '1.75')

        //Loan Credit Grade CECL table part
        // input Gross Loss Rate and Recovery Rate in summary line
        cy.get('div.el-table').eq(2).find('table tr').eq(0).as('loanCreditGradeCeclInputRow')
        cy.get('@loanCreditGradeCeclInputRow').find('input[name="GrossLossRate"]').clear()
        cy.get('@loanCreditGradeCeclInputRow').find('input[name="GrossLossRate"]').type('3{enter}')
        cy.get('@loanCreditGradeCeclInputRow').find('input[name="RecoveryRatio"]').clear()
        cy.get('@loanCreditGradeCeclInputRow').find('input[name="RecoveryRatio"]').type('80{enter}')
        // assert Net Loss Rate, CECL(&000) and CECL(%) in summary line
        cy.get('div.el-table').eq(2).find('table tr').eq(0).children().eq(1).find('table tr').children().as('loanCreditGradeCeclAssertRow')
        cy.get('@loanCreditGradeCeclAssertRow').eq(6).should('have.text', '0.60')
        cy.get('@loanCreditGradeCeclAssertRow').eq(7).should('include.text', '3,392')
        cy.get('@loanCreditGradeCeclAssertRow').eq(8).should('have.text', '1.75')

        //Loan Vintage CECL table part
        // input Gross Loss Rate and Recovery Rate in summary line
        cy.get('div.el-table').eq(3).find('table tr').eq(0).as('loanVintageCeclInputRow')
        cy.get('@loanVintageCeclInputRow').find('input[name="GrossLossRate"]').clear()
        cy.get('@loanVintageCeclInputRow').find('input[name="GrossLossRate"]').type('3{enter}')
        cy.get('@loanVintageCeclInputRow').find('input[name="RecoveryRatio"]').clear()
        cy.get('@loanVintageCeclInputRow').find('input[name="RecoveryRatio"]').type('80{enter}')
        // assert Net Loss Rate, CECL(&000) and CECL(%) in summary line
        cy.get('div.el-table').eq(3).find('table tr').eq(0).children().eq(1).find('table tr').children().as('loanVintageCeclAssertRow')
        cy.get('@loanVintageCeclAssertRow').eq(6).should('have.text', '0.60')
        cy.get('@loanVintageCeclAssertRow').eq(7).should('include.text', '3,379')
        cy.get('@loanVintageCeclAssertRow').eq(8).should('have.text', '1.74')
        
    })

    it('CECL Analytics -> Customized COA Level', () => {
        cy.contains('* Those scenarios are pre-set by THC.').should('be.visible')

        //Loan Credit Grade CECL
        // click Customized COA Level link
        cy.contains('Loan Credit Grade CECL').children().eq(0).click()
        // set Group to COA Level with 3
        cy.get('select[name="amountsIn"]').select('3')
        // click save button
        cy.get('div.popup-win').eq(1).contains('Save').click()
        // assert the special node was show in the page
        cy.get('div.el-table').eq(2).contains('OVERDRAFTS').should('be.visible')
        // click Customized COA Level link
        cy.contains('Loan Credit Grade CECL').children().eq(0).click()
        // set Group to COA Level with 'auto'
        cy.get('select[name="amountsIn"]').select('auto')
        // click save button
        cy.get('div.popup-win').eq(1).contains('Save').click()
        // assert the special node was show in the page
        cy.get('div.el-table').eq(2).contains('OVERDRAFTS').should('not.be.visible')

        // Loan Vintage CECL
        // click Customized COA Level link
        cy.contains('Loan Vintage CECL').children().eq(0).click()
        // set Group to COA Level with 2
        cy.get('select[name="amountsIn"]').select('2')
        // click save button
        cy.get('div.popup-win').eq(1).contains('Save').click()
        // assert the special node was show in the page(Loans->Year 2022->Real Estate Loan)
        cy.get('div.el-table').eq(3).find('table.el-table__body tbody tr').eq(4).children().eq(0).should('have.text', 'Real Estate Loan')
        // click Customized COA Level link
        cy.contains('Loan Vintage CECL').children().eq(0).click()
        // set Group to COA Level with 'auto'
        cy.get('select[name="amountsIn"]').select('auto')
        // click save button
        cy.get('div.popup-win').eq(1).contains('Save').click()
        // assert the special node was not show in the page(Loans->Year 2022->Real Estate Loan)
        cy.get('div.el-table').eq(3).find('table.el-table__body tbody tr').eq(4).children().eq(0).should('not.be.visible')
        
    })
    
    it('CECL Analytics -> +/- icon', () => {
        cy.contains('* Those scenarios are pre-set by THC.').should('be.visible')
        // Loan CECL Analytics '+/-' icon(Loans->Real Estate Loan)
        // click '+' icon
        cy.get('div.el-table').eq(0).contains('Real Estate Loan').find('i.el-icon-arrow-right').click({ force: true})
        // assert '+' -> '-'
        cy.get('div.el-table').eq(0).contains('Real Estate Loan').children().eq(1).should('have.class', 'el-table__expand-icon--expanded')
        // click '-' icon
        cy.get('div.el-table').eq(0).contains('Real Estate Loan').find('i.el-icon-arrow-right').click({ force: true})
        // assert '-' -> '+'
        cy.get('div.el-table').eq(0).contains('Real Estate Loan').children().eq(1).should('not.have.class', 'el-table__expand-icon--expanded')

        //Bank CECL Analytics(Total->ASSETS->Investments)
        // click '+' icon
        cy.get('div.el-table').eq(1).contains('Investments').find('i.el-icon-arrow-right').click({ force: true})
        // assert '+' -> '-'
        cy.get('div.el-table').eq(1).contains('Investments').children().eq(1).should('have.class', 'el-table__expand-icon--expanded')
        // click '-' icon
        cy.get('div.el-table').eq(1).contains('Investments').find('i.el-icon-arrow-right').click({ force: true})
        // assert '-' -> '+'
        cy.get('div.el-table').eq(1).contains('Investments').children().eq(1).should('not.have.class', 'el-table__expand-icon--expanded')

        //Loan Credit Grade CECL(Loans->Fico below 540)
        // click '+' icon
        cy.get('div.el-table').eq(2).contains('Fico below 540').find('i.el-icon-arrow-right').click({ force: true})
        // assert '+' -> '-'
        cy.get('div.el-table').eq(2).contains('Fico below 540').children().eq(1).should('have.class', 'el-table__expand-icon--expanded')
        // click '-' icon
        cy.get('div.el-table').eq(2).contains('Fico below 540').find('i.el-icon-arrow-right').click({ force: true})
        // assert '-' -> '+'
        cy.get('div.el-table').eq(2).contains('Fico below 540').children().eq(1).should('not.have.class', 'el-table__expand-icon--expanded')

        //Loan Vintage CECL(Loans->Year 2022)
        // click '+' icon
        cy.get('div.el-table').eq(3).contains('Year 2022').find('i.el-icon-arrow-right').click({ force: true})
        // assert '+' -> '-'
        cy.get('div.el-table').eq(3).contains('Year 2022').children().eq(1).should('have.class', 'el-table__expand-icon--expanded')
        // click '-' icon
        cy.get('div.el-table').eq(3).contains('Year 2022').find('i.el-icon-arrow-right').click({ force: true})
        // assert '-' -> '+'
        cy.get('div.el-table').eq(3).contains('Year 2022').children().eq(1).should('not.have.class', 'el-table__expand-icon--expanded')

    })

    it.only('CECL Analytics -> Download report' , () => {
        cy.contains('* Those scenarios are pre-set by THC.').should('be.visible')
        // cecltable download
        cy.get('input[value="Download"]').click()
        copyAndCompareExcel()
        cy.wait(1500)

        // Bank CECL Analytics 
        cy.get('a.download-link').click()
        copyAndCompareExcelByGivenFile('CECLAnalytics')
        cy.wait(1500)

        //Loan Credit Grade CECL
        cy.contains('Loan Credit Grade CECL').children().eq(1).click()
        copyAndCompareExcel()
        cy.wait(1500)

        //Loan Vintage CECL
        cy.contains('Loan Vintage CECL').children().eq(1).click()
        copyAndCompareExcel()
    })
})