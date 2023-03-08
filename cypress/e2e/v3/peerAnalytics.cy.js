import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, popConfirm } from "./utils"
const { faker } = require("@faker-js/faker")
describe('Peer Analytics', () => {

    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }
        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Jun 2022')
        clickLinkByName('Performance Insights') 
        clickLinkByName('Peer Analytics')
    })


    it.only('add peer group and delete it', () => {

        const peer_group_name = faker.random.words()
        //click Add button
        cy.get("input[value='Add']").click()
        //input peer goup name
        cy.get("div.row input[type='text']").type(peer_group_name)
        //click save button
        cy.get('div.row button').click()
        //get the last input value and assert that it is the new added
        cy.get('table.lcentral_bid input[type="text"]').last().invoke('val').should('contain', peer_group_name)

        // get the last delete icon to delete the new added peer group
        cy.get('i.el-icon-delete').last().click()
        popConfirm()
        //assert that new added peer group is deleted
        cy.get('table.lcentral_bid input[type="text"]').last().invoke('val').should('not.contain', peer_group_name)
        
    })

    it('add banks to peer group and delete them', () => {
        //select the last peer group link and click to go to select banks page
        cy.get('table.lcentral_bid a').last().click()
        //click search more banks link
        cy.contains('Search More Banks').click()
        //selected all the checkbox in current page
        cy.get('table.lcentral_bid input').each(($checkbox, index, $list) => {
            cy.wrap($checkbox).check() //12 banks will be selected
        })
        //clcik Add button
        cy.get('input[value="Add"]').click()
        popConfirm()
        //assert the 12 banks had added to the peer group
        cy.contains('Search More Banks').next().invoke('text').should('contain', '12 Banks')

        //delete the first bank
        cy.get('i.el-icon-delete').first().click()
        popConfirm()
        //assert the first bank had been deleted
        cy.contains('Search More Banks').next().invoke('text').should('contain', '11 Banks')

        //delete all the banks
        cy.contains('Delete All').click()
        popConfirm()
        //assert all the banks were deleted
        cy.contains('Search More Banks').next().invoke('text').should('contain', '0 Banks')

        //click back icon to return to peer group home page
        cy.get('img[alt="return.png"]').click()
        //assert the last peer group has 0 bank.
        cy.get('table.lcentral_bid a').last().should('contain', '0 bank(s)')

    })
})