const path = require('path')

const downloadsFolder = Cypress.config('downloadsFolder')
const fixturesFolder = Cypress.config('fixturesFolder')
const benchmarkPath = path.join(fixturesFolder.replace(/\\/g, '/'), 'report/benchmark_report/smart_tool')
const generatePath = path.join(fixturesFolder.replace(/\\/g, '/'), 'report/generate_report')
const diffPath = path.join(fixturesFolder.replace(/\\/g, '/'), 'result')

console.log(`fixtureFolder:${fixturesFolder}`)
console.log(`benchmarkPath:${benchmarkPath}`)
console.log(`generatePath:${generatePath}`)
console.log(`downloadsFolder:${downloadsFolder}`)


describe('smart tool', () => {
  it('qtestbank3 smart tool', () => {
    cy.visit('/Account/Login')
    cy.get('#Login').type('v3_ljs')
    cy.get('#Password').type('1')
    cy.get('#rm_submit_btn').click()

    // select bank:QTestBank3
    cy.get('.nirastateF').click()
    cy.get('#abaIdDOM').type('763')
    cy.get('#searchDOM').click()
    cy.get('[title="QTestBank3"]').click()

    //select cycle:202206
    cy.get('#app > section > div > div > span > i').click()
    cy.get('.el-icon--right').last().click() //get total 2 elements and the second is needed
    cy.contains('Jun 2022').click()

    //go to Generate/View Reports page
    cy.contains('Port Analytics & Reporting').click()
    cy.contains('Generate/View Reports').click({ force:true })

    //open smart tool page in current page(not open the new page)
    //cy.contains('Smart Pathbook Tool').invoke('removeAttr', '_blank').click()
    cy.window().then(win => {
      cy.stub(win, 'open').callsFake((url, target) => {
        // call the original `win.open` method
        // but pass the `_self` argument
        return win.open.wrappedMethod.call(win, url, '_self')
      }).as('open')
    })
    cy.contains('Smart Pathbook Tool').click({ force:true })
    cy.get('@open').should('have.been.calledOnce')

    //click root node
    //cy.visit('https://thcdecisions.cn/tlink/external/smartpathfiletool')
    cy.get('#id0').click()

    //open GL(BS) page
    cy.contains('Upload GL(BS)').click()
    cy.get('[value="Next"]').click()
    cy.get('[value="Next"]').click()
    cy.get('[value="Next"]').click()

    const bsAlertStub = cy.stub()
    cy.on('window:alert', bsAlertStub)

    const bsConfirmStub = cy.stub()
    cy.on('window:confirm', bsConfirmStub)

    cy.get('div.popup-win-close').first().click()
    cy.wait(1000)

    //open GL(IS) page
    cy.contains('Upload GL(IS)').click()
    cy.get('[value="Next"]').click()
    cy.get('[value="Next"]').click()
    cy.get('[value="Next"]').click()

    const isAlertStub = cy.stub()
    cy.on('window:alert', isAlertStub)

    const isConfirmStub = cy.stub()
    cy.on('window:confirm', isConfirmStub)

    cy.get('div.popup-win-close').first().click()
    cy.wait(1000)

    //Cash & Short Term node
    cy.get('#id199').click({ force:true })
    cy.get('[value="next2"]').click()
    cy.get('[value="next3"]').click()
    cy.wait(1000)

    //Investments node
    cy.get('#id103').click({ force: true })
    cy.get('[value="next3"]').click({ force:true })
    cy.wait(1000)

    //Loans node
    cy.get('#id104').click({ force: true })
    cy.get('[value="next2"]').click()
    cy.get('[value="next3"]').click()
    cy.wait(1000)

    //Other Assets node
    cy.get('#id105').click({ force: true })
    cy.get('[value="next2"]').click()
    cy.get('[value="next3"]').click()
    cy.wait(1000)

    //Time Deposits node
    cy.get('#id298').click({ force: true })
    cy.get('[value="next2"]').click()
    cy.get('[value="next3"]').click()
    cy.wait(1000)

    //Non Maturity node
    cy.get('#id297').click({ force: true })
    cy.get('[value="next2"]').click()
    cy.get('[value="next3"]').click()
    cy.get('[value="next4"]').click()
    cy.wait(1000)

    //select second file
    cy.get('span.fn').eq(1).click()
    cy.get('[value="next2"]').click()
    cy.get('[value="next3"]').click()
    cy.get('[value="next4"]').click()
    cy.wait(1000)

    //Borrowings node
    cy.get('#id207').click({ force: true })
    cy.get('[value="next2"]').click()
    cy.get('[value="next3"]').click()
    cy.wait(1000)

    //Other Liabilities node
    cy.get('#id209').click({ force: true })
    cy.get('[value="next2"]').click()
    cy.get('[value="next3"]').click()
    cy.wait(1000)

    //Validate and Download PATHBOOK
    cy.get('input[value="Validate and Download PATHBOOK"]').click()
    cy.get('input[value="Download PATHBOOK"]').click()
    cy.wait(5000)

    //copy downloaded pathfile to generate_report folder and then compare the pathfile
    cy.task('copyFileToDirSync', { fromPath:`${downloadsFolder}/`, toPath:`${generatePath}/`}).then((obj) => {
      const benchmarkFilePath = `${benchmarkPath}/${obj.fileName}${obj.extName}`
      const generateFilePath = `${obj.generateFilePath}`
      const diffFilePath = `${diffPath}/${obj.fileName}_${obj.currentTime}_diff${obj.extName}`

      cy.task('compareExcelFile', { benchmarkPath: benchmarkFilePath, generatePath: generateFilePath, diffPath: `${diffFilePath}`})
    })
    
  })
})