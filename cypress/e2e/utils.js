
export const login = (username, password) => {
    cy.visit('/Account/Login')
    cy.get('#Login').type(`${username}`)
    cy.get('#Password').type(`${password}`)
    cy.get('#rm_submit_btn').click()
}

export const selectBankByNameAndABA = (bankName, abaNumber) => {
    cy.get('.nirastateF').click({ force:true })
    cy.get('#abaIdDOM').type(`${abaNumber}`)
    cy.get('#searchDOM').click()
    cy.get(`[title=${bankName}]`).click()
    console.log('selectbank function pass')
}

export const selectBankCycle = (bankCycle) => {
    cy.get('#app > section > div > div > span > i').click()
    cy.get('.el-icon--right').last().click() //get total 2 elements and the second is needed
    cy.contains(`${bankCycle}`).click()
    console.log('selectbankcycle function pass')
}

export const BSISThreeNext = () => {
    cy.get('[value="Next"]').click()
    cy.get('[value="Next"]').click()
    cy.get('[value="Next"]').click()
    console.log('bsisthreethreenext function pass')
}

export const doubleClickNext = () => {
    cy.get('[value="next2"]').click()
    cy.get('[value="next3"]').click()
}

export const openSmartToolPageInCurrentPage = () => {
    cy.window().then(win => {
      cy.stub(win, 'open').callsFake((url, target) => {
        // call the original `win.open` method
        // but pass the `_self` argument
        return win.open.wrappedMethod.call(win, url, '_self')
      }).as('open')
    })
    cy.contains('Smart Pathbook Tool').click({ force:true })
    cy.get('@open').should('have.been.calledOnce')
}

export const clickLinkByName = (linkName) => {
    cy.contains(`${linkName}`).click({ force:true })
}

export const popAlert = () => {
    const alertStub = cy.stub()
    cy.on('window:alert', alertStub)
}

export const popConfirm = () => {
    const confirmStub = cy.stub()
    cy.on('window:confirm', confirmStub)
}