import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, popConfirm, copyAndCompareExcel, waitLoading } from "./utils"
const { faker } = require("@faker-js/faker")
const path = require('path')

describe('Peer Analytics', () => {

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
        // click Peer Analytics tab
        cy.get('.thc-page-tab-container').contains('Peer Analytics').click()
        cy.wait(2000)
    })


    it('add private peer group and delete it', () => {
        const peer_group_name = faker.random.words()
        cy.contains('Peer Group*', {timeout: 30000}).should('be.visible')
        //click Create Peer Group button
        cy.get("input[value='Create Peer Group']").click()
        //input peer goup name
        cy.get("div.row input[type='text']").type(peer_group_name)
        //click save button
        cy.get('div.row button').click()
        //get the last input value and assert that it is the new added
        cy.get('.ag-center-cols-clipper >div >div >div').last().children().eq(1).find('input[type="text"]').invoke('val').should('contain', peer_group_name)

        // get the last delete icon to delete the new added peer group
        cy.get('i.el-icon-delete').last().click()
        popConfirm()
        //assert that new added peer group is deleted
        cy.get('.ag-center-cols-clipper >div >div >div').last().children().eq(1).find('input[type="text"]').invoke('val').should('not.contain', peer_group_name)
    })

    it('add public peer group and delete it', () => {
        const peer_group_name = faker.random.words()
        cy.contains('Peer Group*', {timeout: 30000}).should('be.visible')
        //click Create Peer Group button
        cy.get("input[value='Create Peer Group']").click()
        //check create a public goup
        cy.get('input[value="1"]').check()
        //input peer goup name
        cy.get("div.row input[type='text']").type(peer_group_name)
        //click save button
        cy.get('div.row button').click()
        //get the last input value and assert that it is the new added
        cy.get('.ag-center-cols-clipper >div >div >div').last().children().eq(1).find('input[type="text"]').invoke('val').should('contain', peer_group_name)

        //click Create Peer Group button
        cy.get("input[value='Create Peer Group']").click()
        //check create a public goup
        cy.get('input[value="1"]').check()
        //input same peer goup name
        cy.get("div.row input[type='text']").type(peer_group_name)
        //click save button
        cy.get('div.row button').click().then(() => {
            const alertStub = cy.stub();
            cy.on("window:alert", alertStub);
            //assert not allowed to create a existing peer group
            expect(alertStub.calledWith(peer_group_name))
        })

        // get the last delete icon to delete the new added peer group
        cy.get('i.el-icon-delete').last().click()
        popConfirm()
        //assert that new added peer group is deleted
        cy.get('.ag-center-cols-clipper >div >div >div').last().children().eq(1).find('input[type="text"]').invoke('val').should('not.contain', peer_group_name)
 
    })

    it('add banks to peer group and delete them', () => {
        cy.contains('Peer Group*', {timeout: 30000}).should('be.visible')
        //select the last peer group link and click to go to select banks page
        cy.get('.ag-center-cols-clipper a').last().click()
        waitLoading(30000)
        //selected 5 checkbox in current page
        cy.get('.ag-center-cols-container .ag-input-field-input').each(($checkbox, index, $list) => {
            if (index > 4) {
                return
            }
            cy.wrap($checkbox).check({force: true}) //5 banks will be selected
        })
        //click save button
        cy.contains('Save').click()
        //assert the 5 banks had added to the peer group
        cy.contains('Save').prev().should('contain', '5 Banks')
        waitLoading(5000)

        //select the first bank to delete
        cy.get('.ag-center-cols-container .ag-input-field-input').eq(0).uncheck()
        //click save button
        cy.contains('Save').click()
        waitLoading(5000)
        //assert the first bank had been deleted
        cy.contains('Save').prev().should('contain', '4 Banks')

        //delete the other 4 banks
        cy.get('.ag-center-cols-container .ag-input-field-input').each(($checkbox, index, $list) => {
            if (index == 0 || index == 1 || index == 2 || index == 3) {
                cy.wrap($checkbox).uncheck({force: true}) //4 banks will be selected
            }
            if (index > 4) {
                return
            }
        })
        //click save button
        cy.contains('Save').click()
        waitLoading(5000)
        //assert all the banks were deleted
        cy.contains('Save').prev().should('contain', '0 Banks')

        //click back icon to return to peer group home page
        cy.get('img[title="back"]').click()
        waitLoading(5000)
        //assert the last peer group has 0 bank.
        cy.get('.ag-center-cols-clipper a').last().should('contain', '0 bank(s)')

    })

    it('upload peer group bank list, download peer group bank report and export bank list', () => {
        cy.contains('Peer Group*', {timeout: 30000}).should('be.visible')
        //select the last peer group link and click to go to select banks page
        cy.get('.ag-center-cols-clipper a').last().click()
        //upload peer group bank list file
        cy.get('div[from="peer"] input[name="file"]').selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'SamplePeerMemberImportFile.xlsx'), {force: true})
        //click upload button
        cy.contains('Upload Peer Group').next().next().next().next().click()
        //assert the uploaded bank list has 5 bank.
        cy.contains('Save').prev().should('contain', '5 Banks')

        //upload peer group bank list file again
        cy.get('div[from="peer"] input[name="file"]').selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'SamplePeerMemberImportFile.xlsx'), {force: true})
        //click upload button
        cy.contains('Upload Peer Group').next().next().next().next().click()
        //assert upload the same bank list will give the tips
        cy.contains('the following memebers were in the peer group already').should('exist')
        //click ok button to close the prompt dialog
        cy.get('button.el-button').click()

        //upload peer group bank list file(not recogized) again
        cy.get('div[from="peer"] input[name="file"]').selectFile(path.join(Cypress.config('fixturesFolder'), 'data', 'SamplePeerMemberImportFile_not recogized.xlsx'), {force: true})
        //click upload button
        cy.contains('Upload Peer Group').next().next().next().next().click()
        //assert tips
        cy.contains('The following memebers are not recogized').should('exist')
        //click ok button to close the prompt dialog
        cy.get('button.el-button').click()

        /*
        //download peer group report and compare
        cy.contains('Download Peer Group Report').click()
        copyAndCompareExcel()

        //download peer group bank list and compare
        cy.contains('Export Bank List').click()
        copyAndCompareExcel()
        */

        //delete all the banks back to initial state
        cy.get('.ag-center-cols-container .ag-input-field-input').eq(0).uncheck()
        cy.get('.ag-center-cols-container .ag-input-field-input').eq(1).uncheck()
        cy.get('.ag-center-cols-container .ag-input-field-input').eq(2).uncheck()
        cy.get('.ag-center-cols-container .ag-input-field-input').eq(3).uncheck()
        cy.get('.ag-center-cols-container .ag-input-field-input').eq(4).uncheck()
        //click save button
        cy.contains('Save').click()
        //assert all the banks were deleted
        cy.contains('Save').prev().should('contain', '0 Banks')

    })

    it('add more fields', () => {
        const field_group_name = faker.random.words()
        cy.contains('Peer Group*', {timeout: 30000}).should('be.visible')
        //click Create/Select Report tab
        cy.contains('Create/Select Report').click()
        waitLoading(30000)
        //select peer group
        cy.get('i.el-select__caret').eq(2).click()
        cy.contains('autotest_download_peer_not_delete').click()
        // Download Current View report
        cy.contains('Download Current View').click()
        copyAndCompareExcel()
        //Download Peer Group Report
        cy.contains('Download Peer Group Report').click()
        copyAndCompareExcel()
        //click Add More Fields link
        cy.contains('Add More Fields').click()
        waitLoading(60000)
        //click save as button to open create/update fields group popup
        cy.get('input[value="Save as"]').click()
        //click cancel button to close the dialog
        cy.get('input[value="Cancel"]').click()
        //assert the popup is closed
        cy.get('input[placeholder="Please select or type"]').should('not.exist')

        //input fields name
        cy.get('input[placeholder="Input to search fields"]').type('rcfdjj0')
        cy.wait(1000)
        //select the fields(total 7)
        cy.get('select[multiple="multiple"]').first().select([0, 1, 2, 3, 4, 5, 6])
        //put selected fields to added fields box
        cy.get('i.fa-arrow-right').click()
        //select one field in added fields box
        cy.get('#SelectdFields').select('RCFDJJ03')
        //put added fields to unselected fields box
        cy.get('i.fa-arrow-left').click()
        //select RCFDJJ09 field to up
        cy.get('#SelectdFields').select('RCFDJJ09')
        cy.get('i.fa-arrow-up').click()
        //assert RCFDJJ09 had up one field(index from 5 to 4)
        cy.get('#SelectdFields').select(4).should('contain', 'RCFDJJ09')

        //select RCFDJJ09 field to down
        cy.get('#SelectdFields').select('RCFDJJ09')
        cy.get('i.fa-arrow-down').click()
        //assert RCFDJJ09 had down one field(index from 4 to 5)
        cy.get('#SelectdFields').select(5).should('contain', 'RCFDJJ09')

        //click save as button to open create/update fields group popup
        cy.get('input[value="Save as"]').click()
        //input fields group name
        cy.get('input[placeholder="Please select or type"]').type(field_group_name, {force: true})
        cy.contains(field_group_name).click({force: true})
        //click save button
        cy.get('input[value="Save"]').click()
        //assert susccess message is displayed
        cy.contains('Add to Field Group Successfully!').invoke('text').should('eql', 'Add to Field Group Successfully!')
        //assert the added field group is selected
        cy.contains(field_group_name).invoke('text').should('eql', field_group_name)
        cy.get('select[multiple="multiple"]').first().children().should('have.length', '6')
        cy.contains('RCFDJJ09').invoke('val').should('eql', 'RCFDJJ09')

        //click fields group select list
        cy.get('i.el-select__caret').last().click()
        //click delete icon to delete selected fields
        cy.get('i.el-icon-delete').click()
        //assert delete success message is displayed
        cy.contains('Delete the Fields Groups Successfully!').invoke('text').should('eql', 'Delete the Fields Groups Successfully!')
        //assert the new added field group was deleted
        cy.contains(field_group_name).should('not.exist')

        //switch to CU field group
        cy.contains('<CU>').click({force: true})
        waitLoading(60000)
        //assert cu group fields are displayed
        cy.contains('ACCT').invoke('text').should('include', 'ACCT')

        //download peer group fields and compare
        cy.contains('Export Fields and Description').click()
        copyAndCompareExcel()

        //*for add more fields apply*
        //select two fields to added fields box
        cy.get('select[multiple="multiple"]').first().select(['ACCT_001', 'ACCT_002'])
        //put selected fields to added fields box
        cy.get('i.fa-arrow-right').click()
        //click apply button
        cy.get('input[value="Apply"]').click()
        //assert apply success message is displayed
        cy.contains('Add to Peer Group Successfully!', {timeout: 30000}).invoke('text').should('eql', 'Add to Peer Group Successfully!')
        //assert 'ACCT_001', 'ACCT_002' show in the page
        cy.contains('ACCT_001').invoke('text').should('eql', 'ACCT_001')
        cy.contains('ACCT_002').invoke('text').should('eql', 'ACCT_002')
        waitLoading(20000)

        //*back to initial state*
        //click Add More Fields link
        cy.contains('Add More Fields').click({force: true})
        waitLoading(60000)
        cy.get('#SelectdFields').select(['ACCT_001', 'ACCT_002'])
        //put added fields to unselected fields box
        cy.get('i.fa-arrow-left').click()
        //click apply button
        cy.get('input[value="Apply"]').click()
        //assert apply success message is displayed
        cy.contains('Add to Peer Group Successfully!').invoke('text').should('eql', 'Add to Peer Group Successfully!')
        //assert 'ACCT_001', 'ACCT_002' not show in the page
        cy.contains('ACCT_001').should('not.exist')
        cy.contains('ACCT_002').should('not.exist')

    })
})