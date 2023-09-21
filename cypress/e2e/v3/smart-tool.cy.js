//const path = require('path')
import { login, selectBankByNameAndABA, selectBankCycle, BSISThreeNext, doubleClickNext, openSmartToolPageInCurrentPage,
clickLinkByName, copyAndCompareExcel, copyAndCompareExcelByGivenFile, waitLoading } from './utils'

//const downloadsFolder = Cypress.config('downloadsFolder')
//const fixturesFolder = Cypress.config('fixturesFolder')
//const benchmarkPath = path.join(fixturesFolder.replace(/\\/g, '/'), 'report/benchmark_report/smart_tool')
//const generatePath = path.join(fixturesFolder.replace(/\\/g, '/'), 'report/generate_report')
//const diffPath = path.join(fixturesFolder.replace(/\\/g, '/'), 'result')

//console.log(`fixtureFolder:${fixturesFolder}`)
//console.log(`benchmarkPath:${benchmarkPath}`)
//console.log(`generatePath:${generatePath}`)
//console.log(`downloadsFolder:${downloadsFolder}`)


describe('smart tool', () => {

  beforeEach(() => {

    if (Cypress.env('isCnSite')) {
        login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
    } else {
        login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
    }
    //go to Generate/View Reports page
    clickLinkByName('Port Analytics & Reporting')
    clickLinkByName('Generate/View Reports')

  })

  it('qtestbank1 smart tool', () => {
    //cy.visit('/Account/Login')
    //cy.get('#Login').type('v3_ljs')
    //cy.get('#Password').type('1')
    //cy.get('#rm_submit_btn').click()

    // select bank:QTestBank1
    //cy.get('.nirastateF').click({ force:true })
    //cy.get('#abaIdDOM').type('761')
    //cy.get('#searchDOM').click()
    //cy.get('[title="QTestBank1"]').click()
    selectBankByNameAndABA('QTestBank1', '761')

    //select cycle:202206
    //cy.get('#app > section > div > div > span > i').click()
    //cy.get('.el-icon--right').last().click() //get total 2 elements and the second is needed
    //cy.contains('Jun 2022').click()
    selectBankCycle('Dec 2022')

    //go to Generate/View Reports page
    //cy.contains('Port Analytics & Reporting').click()
    //cy.contains('Generate/View Reports').click({ force:true })
    //clickLinkByName('Port Analytics & Reporting')
    //clickLinkByName('Generate/View Reports')

    //open smart tool page in current page(not open the new page)
    //cy.contains('Smart Pathbook Tool').invoke('removeAttr', '_blank').click()

    /*
    cy.window().then(win => {
      cy.stub(win, 'open').callsFake((url, target) => {
        // call the original `win.open` method
        // but pass the `_self` argument
        return win.open.wrappedMethod.call(win, url, '_self')
      }).as('open')
    })
    cy.contains('Smart Pathbook Tool').click({ force:true })
    cy.get('@open').should('have.been.calledOnce')
    */
    openSmartToolPageInCurrentPage()

    //click root node
    //cy.visit('https://thcdecisions.cn/tlink/external/smartpathfiletool')
    cy.get('#id0').click()

    //open GL(BS) page
    //cy.contains('Upload GL(BS)').click()
    clickLinkByName('Upload GL(BS)')
    //cy.get('[value="Next"]').click()
    //cy.get('[value="Next"]').click()
    //cy.get('[value="Next"]').click()
    BSISThreeNext()

    //const bsAlertStub = cy.stub()
    //cy.on('window:alert', bsAlertStub)

    const bsConfirmStub = cy.stub()
    cy.on('window:confirm', bsConfirmStub)

    cy.get('div.popup-win-close').first().click()
    cy.wait(2000)

    //open GL(IS) page
    //cy.contains('Upload GL(IS)').click()
    clickLinkByName('Upload GL(IS)')
    //cy.get('[value="Next"]').click()
    //cy.get('[value="Next"]').click()
    //cy.get('[value="Next"]').click()
    BSISThreeNext()

    //const isAlertStub = cy.stub()
    //cy.on('window:alert', isAlertStub)

    const isConfirmStub = cy.stub()
    cy.on('window:confirm', isConfirmStub)

    cy.get('div.popup-win-close').first().click()
    cy.wait(2000)

    //Cash & Short Term node
    cy.get('#id199').click({ force:true })
    //cy.get('[value="next2"]').click()
    //cy.get('[value="next3"]').click()
    doubleClickNext()

    //Investments node
    cy.get('#id103').click({ force: true })
    waitLoading(180000)
    cy.get('[value="next3"]').click({ force:true })
    waitLoading(180000)

    //select second file
    cy.get('span.fn').eq(1).click({ force:true })
    //cy.get('[value="next2"]').click()
    //cy.get('[value="next3"]').click()
    doubleClickNext()

    //Loans node
    cy.get('#id104').click({ force: true })
    //cy.get('[value="next2"]').click()
    //cy.get('[value="next3"]').click()
    doubleClickNext()

    //select second file
    cy.get('span.fn').eq(1).click( {force:true} )
    //cy.get('[value="next2"]').click()
    //cy.get('[value="next3"]').click()
    doubleClickNext()

    //Other Assets node
    cy.get('#id105').click({ force: true })
    //cy.get('[value="next2"]').click()
    //cy.get('[value="next3"]').click()
    doubleClickNext()

    //Time Deposits node
    cy.get('#id298').click({ force: true })
    //cy.get('[value="next2"]').click()
    //cy.get('[value="next3"]').click()
    doubleClickNext()

    //Non Maturity node
    cy.get('#id297').click({ force: true })
    //cy.get('[value="next2"]').click()
    //cy.get('[value="next3"]').click()
    doubleClickNext()
    cy.get('[value="next4"]').click()
    waitLoading(180000)

    //select second file
    cy.get('span.fn').eq(1).click({ force: true} )
    //cy.get('[value="next2"]').click()
    //cy.get('[value="next3"]').click()
    doubleClickNext()
    cy.wait(2000)
    cy.get('[value="next4"]').click({ force: true})
    waitLoading(180000)

    //select three file
    cy.get('span.fn').eq(2).click({ force: true })
    //cy.get('[value="next2"]').click()
    //cy.get('[value="next3"]').click()
    doubleClickNext()
    cy.get('[value="next4"]').click()
    waitLoading(180000)

    //Borrowings node
    cy.get('#id207').click({ force: true })
    //cy.get('[value="next2"]').click()
    //cy.get('[value="next3"]').click()
    doubleClickNext()

    //select second file
    cy.get('span.fn').eq(1).click({ force:true })
    //cy.get('[value="next2"]').click()
    //cy.get('[value="next3"]').click()
    doubleClickNext()

    //select three file
    cy.get('span.fn').eq(2).click({ force:true })
    //cy.get('[value="next2"]').click()
    //cy.get('[value="next3"]').click()
    doubleClickNext()

    //Other Liabilities node
    cy.get('#id209').click({ force: true })
    //cy.get('[value="next2"]').click()
    //cy.get('[value="next3"]').click()
    doubleClickNext()

    //Validate and Download PATHBOOK
    cy.get('input[value="Validate and Download PATHBOOK"]').click()
    cy.wait(2000)
    cy.get('input[value="Download PATHBOOK"]').click({ force:true })
    //cy.wait(10000)

    copyAndCompareExcel()

    /*
    //copy downloaded pathfile to generate_report folder and then compare the pathfile
    cy.task('copyFileToDirSync', { fromPath:`${downloadsFolder}/`, toPath:`${generatePath}/`}).then((obj) => {
      const benchmarkFilePath = `${benchmarkPath}/${obj.fileName}${obj.extName}`
      const generateFilePath = `${obj.generateFilePath}`
      const diffFilePath = `${diffPath}/${obj.fileName}_${obj.currentTime}_diff${obj.extName}`

      cy.task('compareExcelFile', { benchmarkPath: benchmarkFilePath, generatePath: generateFilePath, diffPath: `${diffFilePath}`})
    })
    */


  })


  it('qtestbank2 smart tool', () => {
    // select bank:QTestBank2
    selectBankByNameAndABA('QTestBank2','762')

    //select cycle:202206
    selectBankCycle('Dec 2022')

    //open smart tool page in current page(not open the new page)
    //cy.contains('Smart Pathbook Tool').invoke('removeAttr', '_blank').click()
    openSmartToolPageInCurrentPage()

    //click root node
    //cy.visit('https://thcdecisions.cn/tlink/external/smartpathfiletool')
    cy.get('#id0').click()

    //open GL(BS) page
    clickLinkByName('Upload GL(BS)')
    BSISThreeNext()

    //const bsAlertStub = cy.stub()
    //cy.on('window:alert', bsAlertStub)

    const bsConfirmStub = cy.stub()
    cy.on('window:confirm', bsConfirmStub)

    cy.get('div.popup-win-close').first().click()
    cy.wait(2000)

    //open GL(IS) page
    clickLinkByName('Upload GL(IS)')
    BSISThreeNext()

    //const isAlertStub = cy.stub()
    //cy.on('window:alert', isAlertStub)

    const isConfirmStub = cy.stub()
    cy.on('window:confirm', isConfirmStub)

    cy.get('div.popup-win-close').first().click()
    cy.wait(2000)

    //Cash & Short Term node
    cy.get('#id199').click({ force:true })
    doubleClickNext()

    //Investments node
    cy.get('#id103').click({ force: true })
    waitLoading(180000)
    cy.get('[value="next3"]').click({ force:true })
    waitLoading(180000)

    //select second file
    cy.get('span.fn').eq(1).click({ force:true })
    doubleClickNext()

    //Loans node
    cy.get('#id104').click({ force: true })
    doubleClickNext()

    //select second file
    cy.get('span.fn').eq(1).click({ force:true })
    doubleClickNext()

    //Other Assets node
    cy.get('#id105').click({ force: true })
    doubleClickNext()

    //Time Deposits node
    cy.get('#id298').click({ force: true })
    doubleClickNext()

    //select second file
    cy.get('span.fn').eq(1).click({ force: true })
    doubleClickNext()

    //Non Maturity node
    cy.get('#id297').click({ force: true })
    doubleClickNext()
    cy.wait(2000)
    cy.get('[value="next4"]').click()
    waitLoading(180000)

    //select second file
    cy.get('span.fn').eq(1).click({ force:true })
    doubleClickNext()
    cy.wait(2000)
    cy.get('[value="next4"]').click()
    waitLoading(180000)

    //Borrowings node
    cy.get('#id207').click({ force: true })
    doubleClickNext()

    //select second file
    cy.get('span.fn').eq(1).click({ force:true })
    doubleClickNext()

    //Other Liabilities node
    cy.get('#id209').click({ force: true })
    doubleClickNext()

    //Validate and Download PATHBOOK
    cy.get('input[value="Validate and Download PATHBOOK"]').click()
    cy.wait(2000)
    cy.get('input[value="Download PATHBOOK"]').click({ force:true })
    //cy.wait(10000)

    copyAndCompareExcel()

  })


  it('qtestbank3 smart tool', () => {
    // select bank:QTestBank3
    selectBankByNameAndABA('QTestBank3', '763')

    //select cycle:202206
    selectBankCycle('Dec 2022')

    //open smart tool page in current page(not open the new page)
    //cy.contains('Smart Pathbook Tool').invoke('removeAttr', '_blank').click()
    openSmartToolPageInCurrentPage()
    
    //click root node
    //cy.visit('https://thcdecisions.cn/tlink/external/smartpathfiletool')
    cy.get('#id0').click()

    //open GL(BS) page
    clickLinkByName('Upload GL(BS)')
    BSISThreeNext()

    const bsAlertStub = cy.stub()
    cy.on('window:alert', bsAlertStub)

    const bsConfirmStub = cy.stub()
    cy.on('window:confirm', bsConfirmStub)

    cy.get('div.popup-win-close').first().click()
    cy.wait(2000)

    //open GL(IS) page
    clickLinkByName('Upload GL(IS)')
    BSISThreeNext()

    const isAlertStub = cy.stub()
    cy.on('window:alert', isAlertStub)

    const isConfirmStub = cy.stub()
    cy.on('window:confirm', isConfirmStub)

    cy.get('div.popup-win-close').first().click()
    cy.wait(2000)

    //Cash & Short Term node
    cy.get('#id199').click({ force:true })
    //cy.wait(5000)
    doubleClickNext()

    //Investments node
    cy.get('#id103').click({ force: true })
    waitLoading(180000)
    cy.get('[value="next3"]').click({ force:true })
    waitLoading(180000)

    //Loans node
    cy.get('#id104').click({ force: true })
    doubleClickNext()

    //Other Assets node
    cy.get('#id105').click({ force: true })
    doubleClickNext()

    //Time Deposits node
    cy.get('#id298').click({ force: true })
    doubleClickNext()

    //Non Maturity node
    cy.get('#id297').click({ force: true })
    doubleClickNext()
    cy.wait(2000)
    cy.get('[value="next4"]').click()
    waitLoading(180000)

    //select second file
    cy.get('span.fn').eq(1).click({ force:true })
    doubleClickNext()
    cy.wait(2000)
    cy.get('[value="next4"]').click()
    waitLoading(180000)

    //Borrowings node
    cy.get('#id207').click({ force: true })
    doubleClickNext()

    //Other Liabilities node
    cy.get('#id209').click({ force: true })
    doubleClickNext()

    //Validate and Download PATHBOOK
    cy.get('input[value="Validate and Download PATHBOOK"]').click()
    cy.wait(2000)
    cy.get('input[value="Download PATHBOOK"]').click({ force:true })
    //cy.wait(10000)

    copyAndCompareExcel()

  })

  it('qtestbank4 smart tool', () => {
    // select bank:QTestBank3
    selectBankByNameAndABA('QTestBank4', '764')

    //select cycle:202206
    selectBankCycle('Dec 2022')

    //open smart tool page in current page(not open the new page)
    //cy.contains('Smart Pathbook Tool').invoke('removeAttr', '_blank').click()
    openSmartToolPageInCurrentPage()
    
    //click root node
    //cy.visit('https://thcdecisions.cn/tlink/external/smartpathfiletool')
    cy.get('#id0').click()

    //open GL(BS) page
    clickLinkByName('Upload GL(BS)')
    BSISThreeNext()

    const bsConfirmStub = cy.stub()
    cy.on('window:confirm', bsConfirmStub)

    cy.get('div.popup-win-close').first().click()
    cy.wait(2000)

    //open GL(IS) page
    clickLinkByName('Upload GL(IS)')
    BSISThreeNext()

    const isConfirmStub = cy.stub()
    cy.on('window:confirm', isConfirmStub)

    cy.get('div.popup-win-close').first().click()
    cy.wait(2000)

    //Cash & Short Term node
    cy.get('#id199').click({ force:true })
    //cy.wait(5000)
    doubleClickNext()

    //Investments node
    cy.get('#id103').click({ force: true })
    waitLoading(180000)
    cy.get('[value="next3"]').click({ force:true })
    waitLoading(180000)

    //select second file
    cy.get('span.fn').eq(1).click({ force:true })
    doubleClickNext()

    //select third file
    cy.get('span.fn').eq(2).click({ force:true })
    doubleClickNext()

    //Loans node
    cy.get('#id104').click({ force: true })
    doubleClickNext()

    //select second file
    cy.get('span.fn').eq(1).click({ force:true })
    doubleClickNext()

    //Other Assets node
    cy.get('#id105').click({ force: true })
    doubleClickNext()

    //Time Deposits node
    cy.get('#id298').click({ force: true })
    doubleClickNext()

    //select second file
    cy.get('span.fn').eq(1).click({ force:true })
    doubleClickNext()

    //Non Maturity node
    cy.get('#id297').click({ force: true })
    doubleClickNext()
    cy.wait(2000)
    cy.get('[value="next4"]').click()
    waitLoading(180000)

    //select second file
    cy.get('span.fn').eq(1).click({ force:true })
    doubleClickNext()
    cy.wait(2000)
    cy.get('[value="next4"]').click()
    waitLoading(180000)

    //Borrowings node
    cy.get('#id207').click({ force: true })
    doubleClickNext()

    //select second file
    cy.get('span.fn').eq(1).click({ force:true })
    doubleClickNext()

    //Other Liabilities node
    cy.get('#id209').click({ force: true })
    doubleClickNext()

    //Validate and Download PATHBOOK
    cy.get('input[value="Validate and Download PATHBOOK"]').click()
    cy.wait(2000)
    cy.get('input[value="Download PATHBOOK"]').click({ force:true })
    //cy.wait(10000)

    copyAndCompareExcel()

  })


  it('qtestbank5 smart tool', () => {
    /*
    cy.visit('/Account/Login')
    cy.get('#Login').type('v3_ljs')
    cy.get('#Password').type('1')
    cy.get('#rm_submit_btn').click()
    */

    // select bank:QTestBank5
    cy.get('.nirastateF', {timeout: 60000}).click()

    if (Cypress.env('isCnSite')) {
        cy.get('#abaIdDOM').type('765')
    } else {
        cy.get('#abaIdDOM').type('767')
    }

    //cy.get('#abaIdDOM').type('765')
    cy.wait(2000)
    cy.get('#searchDOM').click()
    cy.wait(3000)
    cy.get('[title="QTestBank5"]').click()
    //assert select client list disappear
    //cy.get('div.popup-win').should('not.be.visible', {timeout: 60000})
    cy.get(`td[title="QTestBank5"]`, {timeout: 60000}).should('not.be.visible')
    cy.wait(2000)

    //select cycle:202206
    //cy.get('#app > section > div > div > span > i').click()
    cy.get('div.HiveMindDirect-title i.el-icon-arrow-down').click()
    cy.get('.el-icon--right').last().click() //get total 2 elements and the second is needed
    cy.contains('Dec 2022').click()
    cy.wait(2000)

    //go to Generate/View Reports page
    //cy.contains('Port Analytics & Reporting').click()
    //cy.contains('Generate/View Reports').click({ force:true })

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
    cy.get('#id0', {timeout: 120000}).should('exist')

    //click root node
    //cy.visit('https://thcdecisions.cn/tlink/external/smartpathfiletool')
    cy.get('#id0').click()
    //open GL(BS) page
    cy.contains('Upload GL(BS)').click()
    waitLoading(180000)
    cy.get('[value="Next"]').click()
    waitLoading(180000)
    cy.get('[value="Next"]').click()
    waitLoading(180000)
    cy.get('[value="Next"]').click()
    waitLoading(180000)

    //const bsAlertStub = cy.stub()
    //cy.on('window:alert', bsAlertStub)

    const bsConfirmStub = cy.stub()
    cy.on('window:confirm', bsConfirmStub)

    cy.get('div.popup-win-close').first().click()
    cy.wait(2000)

    //open GL(IS) page
    cy.contains('Upload GL(IS)').click()
    waitLoading(180000)
    cy.get('[value="Next"]').click()
    waitLoading(180000)
    cy.get('[value="Next"]').click()
    waitLoading(180000)
    cy.get('[value="Next"]').click()
    waitLoading(180000)

    //const isAlertStub = cy.stub()
    //cy.on('window:alert', isAlertStub)

    //const isConfirmStub = cy.stub()
    //cy.on('window:confirm', isConfirmStub)

    cy.get('div.popup-win-close').first().click()
    cy.wait(2000)

    //Cash & Short Term node
    cy.get('#id199').click({ force:true })
    waitLoading(180000)
    cy.get('[value="next2"]').click()
    waitLoading(180000)
    cy.get('[value="next3"]').click()
    waitLoading(180000)

    //Investments node
    cy.get('#id103').click({ force: true })
    waitLoading(180000)
    cy.get('[value="next3"]').click({ force:true })
    waitLoading(180000)

    //select second file
    cy.get('span.fn').eq(1).click({ force: true })
    waitLoading(180000)
    cy.get('[value="next2"]').click()
    waitLoading(180000)
    cy.get('[value="next3"]').click()
    waitLoading(180000)

    //Loans node
    cy.get('#id104').click({ force: true })
    waitLoading(180000)
    cy.get('[value="next2"]').click()
    waitLoading(180000)
    cy.get('[value="next3"]').click()
    waitLoading(180000)

    //select second file
    cy.get('span.fn').eq(1).click({ force: true })
    waitLoading(180000)
    cy.get('[value="next2"]').click()
    waitLoading(180000)
    cy.get('[value="next3"]').click()
    waitLoading(180000)

    //Other Assets node
    cy.get('#id105').click({ force: true })
    waitLoading(180000)
    cy.get('[value="next2"]').click()
    waitLoading(180000)
    cy.get('[value="next3"]').click()
    waitLoading(180000)

    //Time Deposits node
    cy.get('#id298').click({ force: true })
    waitLoading(180000)
    cy.get('[value="next2"]').click()
    waitLoading(180000)
    cy.get('[value="next3"]').click()
    waitLoading(180000)

    //select second file
    cy.get('span.fn').eq(1).click({ force: true })
    waitLoading(180000)
    cy.get('[value="next2"]').click()
    waitLoading(180000)
    cy.get('[value="next3"]').click()
    waitLoading(180000)

    //Non Maturity node
    cy.get('#id297').click({ force: true })
    waitLoading(180000)
    cy.get('[value="next2"]').click()
    waitLoading(180000)
    cy.get('[value="next3"]').click({ force: true })
    waitLoading(180000)
    cy.wait(2000)
    cy.get('[value="next4"]').click()
    waitLoading(180000)

    //select second file
    cy.get('span.fn').eq(1).click({ force: true })
    waitLoading(180000)
    cy.get('[value="next2"]').click()
    waitLoading(180000)
    cy.get('[value="next3"]').click()
    waitLoading(180000)
    cy.wait(2000)
    cy.get('[value="next4"]').click()
    waitLoading(180000)

    //Borrowings node
    cy.get('#id207').click({ force: true })
    waitLoading(180000)
    cy.get('[value="next2"]').click()
    waitLoading(180000)
    cy.get('[value="next3"]').click()
    waitLoading(180000)

    //select second file
    cy.get('span.fn').eq(1).click({ force: true })
    waitLoading(180000)
    cy.get('[value="next2"]').click()
    waitLoading(180000)
    cy.get('[value="next3"]').click()
    waitLoading(180000)

    //Other Liabilities node
    cy.get('#id209').click({ force: true })
    waitLoading(180000)
    cy.get('[value="next2"]').click()
    waitLoading(180000)
    cy.get('[value="next3"]').click()
    waitLoading(180000)

    //Validate and Download PATHBOOK
    cy.get('input[value="Validate and Download PATHBOOK"]').click()
    cy.wait(2000)
    cy.get('input[value="Download PATHBOOK"]').click({ force:true })
    //cy.wait(10000)

    copyAndCompareExcel()

    /*
    //copy downloaded pathfile to generate_report folder and then compare the pathfile
    cy.task('copyFileToDirSync', { fromPath:`${downloadsFolder}/`, toPath:`${generatePath}/`}).then((obj) => {
      const benchmarkFilePath = `${benchmarkPath}/${obj.fileName}${obj.extName}`
      const generateFilePath = `${obj.generateFilePath}`
      const diffFilePath = `${diffPath}/${obj.fileName}_${obj.currentTime}_diff${obj.extName}`

      cy.task('compareExcelFile', { benchmarkPath: benchmarkFilePath, generatePath: generateFilePath, diffPath: `${diffFilePath}`})
    })
    */
  })

  it('CORDER BANK, THE', () => {
    // select bank:CORDER BANK, THE
    selectBankByNameAndABA('CORDER BANK, THE','101909398')

    //select cycle:202109
    selectBankCycle('Sep 2021')

    //open smart tool page in current page(not open the new page)
    //cy.contains('Smart Pathbook Tool').invoke('removeAttr', '_blank').click()
    openSmartToolPageInCurrentPage()

    //click root node
    //cy.visit('https://thcdecisions.cn/tlink/external/smartpathfiletool')
    cy.get('#id0').click()

    //open GL(BS) page
    clickLinkByName('Upload GL(BS)')
    BSISThreeNext()

    //const bsAlertStub = cy.stub()
    //cy.on('window:alert', bsAlertStub)

    const bsConfirmStub = cy.stub()
    cy.on('window:confirm', bsConfirmStub)

    cy.get('div.popup-win-close').first().click()
    cy.wait(2000)

    //open GL(IS) page
    clickLinkByName('Upload GL(IS)')
    BSISThreeNext()

    //const isAlertStub = cy.stub()
    //cy.on('window:alert', isAlertStub)

    const isConfirmStub = cy.stub()
    cy.on('window:confirm', isConfirmStub)

    cy.get('div.popup-win-close').first().click()
    cy.wait(2000)

    //Cash & Short Term node
    cy.get('#id199').click({ force:true })
    doubleClickNext()

    //Investments node
    cy.get('#id103').click({ force: true })
    waitLoading(180000)
    cy.get('[value="next3"]').click({ force:true })
    waitLoading(180000)

    //Loans node
    cy.get('#id104').click({ force: true })
    doubleClickNext()

    //select second file
    cy.get('span.fn').eq(1).click({ force:true })
    doubleClickNext()

    //Other Assets node
    cy.get('#id105').click({ force: true })
    doubleClickNext()

    //Time Deposits node
    // 1. T002 set to SELF-INDEX
    // 2. click Next, T002 in pathfile will be self-index
    // 3. click left tree
    // 4. T002 will not be self-index and be replaced by normal index + spread
    // 5. click Next
    // 6. pathfile T002 will not be self-index and be replaced by normal index
    cy.get('#id298').click({ force: true })
    //doubleClickNext()

    waitLoading(180000)
    cy.get('[value="next2"]', {timeout: 20000}).click({ force: true });
    waitLoading(180000)
    // click advanced setting of index
    cy.contains('T002').next().next().next().find('a').click()
    cy.get('table.mapping-tbl').find('select').eq(1).select('Self-Index', {force: true})
    cy.get('.stepContent .popup-win').find('input[value="OK"]').click()
    cy.get('[value="next3"]', {timeout: 20000}).click({ force: true });
    waitLoading(180000)
    cy.contains('Self-Index').should('exist')
    //Validate and Download PATHBOOK
    cy.get('input[value="Validate and Download PATHBOOK"]').click()
    cy.wait(2000)
    cy.get('input[value="Download PATHBOOK"]').click({ force:true })
    copyAndCompareExcelByGivenFile('CORDER BANK, THE_SmartTool_PathFile_Self-Index')
    cy.wait(3000)

    //Other Assets node
    cy.get('#id105').click({ force: true })
    waitLoading(180000)
    // Time Deposits node
    cy.get('#id298').click({ force: true })
    doubleClickNext()
    cy.contains('3-Year-FHLB advance rate').should('exist')
    /*
    //Validate and Download PATHBOOK
    cy.get('input[value="Validate and Download PATHBOOK"]').click()
    cy.wait(2000)
    cy.get('input[value="Download PATHBOOK"]').click({ force:true })
    copyAndCompareExcel()
    */

    //Non Maturity node
    cy.get('#id297').click({ force: true })
    doubleClickNext()
    cy.wait(2000)
    cy.get('[value="next4"]').click()
    waitLoading(180000)

    //Other Liabilities node
    cy.get('#id209').click({ force: true })
    doubleClickNext()

    //Validate and Download PATHBOOK
    cy.get('input[value="Validate and Download PATHBOOK"]').click()
    cy.wait(2000)
    cy.get('input[value="Download PATHBOOK"]').click({ force:true })
    //cy.wait(10000)

    copyAndCompareExcel()
  })

  it('TLINK1554', () => {
    // select bank:DRAKE BANK
    selectBankByNameAndABA('DRAKE BANK', '96017230')

    //select cycle:202308
    selectBankCycle('Aug 2023')

    //open smart tool page in current page(not open the new page)
    //cy.contains('Smart Pathbook Tool').invoke('removeAttr', '_blank').click()
    openSmartToolPageInCurrentPage()
    
    //click root node
    //cy.visit('https://thcdecisions.cn/tlink/external/smartpathfiletool')
    cy.get('#id0').click()
    cy.wait(3000)

    //Cash & Short Term node
    cy.get('#id199').click({ force:true })
    //cy.wait(5000)
    waitLoading(180000)
    cy.get('[value="next2"]', {timeout: 20000}).click({ force: true });
    waitLoading(180000)
    cy.get('table[name="tbloan"]').contains('advanced setting').click()
    cy.get('.mapping-tbl tbody tr').eq(3).find('td').eq(2).find('input[type="text"]').invoke('val').should('contain', 'Cash Items')
    
  })
    

})