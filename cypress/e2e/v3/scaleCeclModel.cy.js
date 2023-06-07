import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcelByGivenFile, waitLoading } from "./utils"
const path = require('path')

describe('SCALE CECL Model', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }

        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Risk Analytics & Reporting')
        clickLinkByName('SCALE CECL Model')
        waitLoading(5000)
    })

    it('SCALE CECL Model -> input values', () => {
        // click save button directly
        cy.get('input[value="Save"]').click()
        // assert save success message
        cy.contains('Save Successfully.').should('exist')
        // custom input
        cy.contains('Real Estate - Construction').parent().next().next().find('input').type('1000{enter}')
        cy.contains('Real Estate - Commercial').parent().next().next().find('input').type('1000{enter}')
        cy.contains('Real Estate - Residential').parent().next().next().find('input').type('1000{enter}')
        // Adj. for Qualitative Factors (%)
        cy.contains('Real Estate - Construction').parent().parent().children().eq(6).find('input').clear()
        cy.contains('Real Estate - Construction').parent().parent().children().eq(6).find('input').type('10{enter}')
        cy.contains('Real Estate - Commercial').parent().parent().children().eq(6).find('input').clear()
        cy.contains('Real Estate - Commercial').parent().parent().children().eq(6).find('input').type('10{enter}')
        cy.contains('Real Estate - Residential').parent().parent().children().eq(6).find('input').clear()
        cy.contains('Real Estate - Residential').parent().parent().children().eq(6).find('input').type('10{enter}')
        // Comments
        cy.contains('Real Estate - Construction').parent().parent().children().eq(9).find('input').type('comments1')
        cy.contains('Real Estate - Commercial').parent().parent().children().eq(9).find('input').type('comments2')
        cy.contains('Real Estate - Residential').parent().parent().children().eq(9).find('input').type('comments3')
        // assert sumary info
        cy.contains('CECL ACL Total').next().should('have.value', '333')
        cy.contains('Adjustment for Historical Loss Experience').next().should('have.value', '0')
        cy.contains('Expected Losses on Loans Assessed on Individual Basis').next().should('have.value', '0')
        cy.contains('Total Expected Losses on Loans').next().should('have.value', '333')
        cy.contains('ACL/Total Loans (%)').next().should('have.value', '11.11')

        // click Add rows link(Summary table)
        cy.contains('Add rows').click()
        // assert the new row is added
        cy.contains('Additional Segments1').should('exist')
        // click delete icon
        cy.get('img[title="delete"]').click()
        // assert the new row is deleted
        cy.contains('Additional Segments1').should('not.be.exist')

        // click Add rows link(Individually Assessed table)
        cy.get('table.individual-tbl').next().click()
        // input values
        cy.get('table.individual-tbl tbody tr td input').then(($inputs) => {
            $inputs.each((index, $input) => {
                cy.wrap($input).type('1000{enter}')
            })
        })
        // assert sumary info
        cy.contains('CECL ACL Total').next().should('have.value', '-182')
        cy.contains('Adjustment for Historical Loss Experience').next().should('have.value', '0')
        cy.contains('Expected Losses on Loans Assessed on Individual Basis').next().should('have.value', '11,000')
        cy.contains('Total Expected Losses on Loans').next().should('have.value', '10,818')
        cy.contains('ACL/Total Loans (%)').next().should('have.value', '360.59')
    
        // click delete icon
        cy.get('img[title="delete"]').click()
        // click save button
        cy.get('input[value="Save"]').click()
        // assert save success message
        cy.contains('Save Successfully.').should('exist')
        // assert sumary info
        cy.contains('CECL ACL Total').next().should('have.value', '333')
        cy.contains('Adjustment for Historical Loss Experience').next().should('have.value', '0')
        cy.contains('Expected Losses on Loans Assessed on Individual Basis').next().should('have.value', '0')
        cy.contains('Total Expected Losses on Loans').next().should('have.value', '333')
        cy.contains('ACL/Total Loans (%)').next().should('have.value', '11.11')
        // click clear button
        cy.get('input[value="Clear"].buttonBar').click()
        // assert clear success info
        cy.contains('Clear Successfully.').should('exist')

    })

    it('SCALE CECL Model -> upload file', () => {
        // upload file
        cy.get('input[name="idImportFile_1"]').selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'Scale_CECL_Model_(QTestBank3-202212).xlsx'), {force: true})
        // click upload button
        cy.get('div.el-card__body').contains('Upload').click()
        // assert success message
        cy.contains('Upload Successfully.').should('exist')
        //click download button
        cy.get('input[value="Download"].buttonBar').click()
        copyAndCompareExcelByGivenFile('Scale_CECL_Model_(QTestBank3-202212)')
        // assert sumary info
        cy.contains('CECL ACL Total').next().should('have.value', '333')
        cy.contains('Adjustment for Historical Loss Experience').next().should('have.value', '0')
        cy.contains('Expected Losses on Loans Assessed on Individual Basis').next().should('have.value', '0')
        cy.contains('Total Expected Losses on Loans').next().should('have.value', '333')
        cy.contains('ACL/Total Loans (%)').next().should('have.value', '11.11')

        // select autotest_not_delete peer group
        cy.contains('CECL ACL Lifetime').find('select').select('autotest_not_delete')
        waitLoading(10000)
        // click save button
        cy.get('input[value="Save"]').click()
        // assert save success message
        cy.contains('Save Successfully.').should('exist')
        // click refresh icon
        cy.get('img[title="refresh"]').click()
        // assert sumary info
        cy.contains('CECL ACL Total').next().should('have.value', '300')
        cy.contains('Adjustment for Historical Loss Experience').next().should('have.value', '0')
        cy.contains('Expected Losses on Loans Assessed on Individual Basis').next().should('have.value', '0')
        cy.contains('Total Expected Losses on Loans').next().should('have.value', '300')
        cy.contains('ACL/Total Loans (%)').next().should('have.value', '10.00')
        // select National peer group
        cy.contains('CECL ACL Lifetime').find('select').select('National')
        waitLoading(10000)
        // assert sumary info
        cy.contains('CECL ACL Total').next().should('have.value', '333')
        cy.contains('Adjustment for Historical Loss Experience').next().should('have.value', '0')
        cy.contains('Expected Losses on Loans Assessed on Individual Basis').next().should('have.value', '0')
        cy.contains('Total Expected Losses on Loans').next().should('have.value', '333')
        cy.contains('ACL/Total Loans (%)').next().should('have.value', '11.11')

        // click clear button
        cy.get('input[value="Clear"].buttonBar').click()
        // assert clear success info
        cy.contains('Clear Successfully.').should('exist')
        // click save button
        cy.get('input[value="Save"]').click()
        // assert sumary info
        cy.contains('CECL ACL Total').next().should('have.value', '0')
        cy.contains('Adjustment for Historical Loss Experience').next().should('have.value', '0')
        cy.contains('Expected Losses on Loans Assessed on Individual Basis').next().should('have.value', '0')
        cy.contains('Total Expected Losses on Loans').next().should('have.value', '0')
        cy.contains('ACL/Total Loans (%)').next().should('have.value', '0.00')
        
    })
})