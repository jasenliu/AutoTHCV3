const path = require('path')
const fs = require('fs')

const downloadsFolder = Cypress.config('downloadsFolder')
const fixturesFolder = Cypress.config('fixturesFolder')
const benchmarkPath = path.join(fixturesFolder.replace(/\\/g, '/'), 'report/benchmark_report/smart_tool')
const generatePath = path.join(fixturesFolder.replace(/\\/g, '/'), 'report/generate_report')
const diffPath = path.join(fixturesFolder.replace(/\\/g, '/'), 'result')

export const login = (username, password) => {
  if (Cypress.env('isCnSite')) {
    cy.visit("/Account/Login");
  } else {
    cy.visit(Cypress.env('v3_com_baseUrl') + '/Account/Login')
  }
  cy.get("#Login").type(`${username}`);
  cy.get("#Password").type(`${password}`);
  cy.get("#rm_submit_btn").click();
  //cy.wait(2000);
};

export const selectBankByNameAndABA = (bankName, abaNumber) => {
  cy.get(".nirastateF",{timeout: 120000}).click({ force: true });
  cy.get("#abaIdDOM").type(`${abaNumber}`);
  cy.wait(3000)
  cy.get("#searchDOM").click();
  cy.wait(3000)
  cy.get(`[title="${bankName}"]`, {timeout: 30000}).click();
  //assert select client list disappear
  //cy.get('div.popup-win-client').should('not.be.visible', {timeout: 60000})
  cy.get(`td[title="${bankName}"]`, {timeout: 60000}).should('not.be.visible')
  waitLoading(20000)
  cy.wait(3000)
};

export const selectBankCycle = (bankCycle) => {
  cy.get('div.HiveMindDirect-title i.el-icon-arrow-down').click()
  //cy.get('#app > section > div > div > span > i').click()
  cy.get(".el-icon--right").last().click(); //get total 2 elements and the second is needed
  cy.contains(`${bankCycle}`).click();
  cy.wait(1000);
};

export const BSISThreeNext = () => {
  waitLoading(180000)
  cy.get('[value="Next"]').click();
  waitLoading(180000)
  cy.get('[value="Next"]').click();
  waitLoading(180000)
  cy.get('[value="Next"]').click();
  waitLoading(180000)
};

export const doubleClickNext = () => {
  //cy.wait(5000);
  waitLoading(180000)
  cy.get('[value="next2"]', {timeout: 20000}).click({ force: true });
  waitLoading(180000)
  cy.get('[value="next3"]', {timeout: 20000}).click({ force: true });
  waitLoading(180000)
};

export const waitLoading = (time) => {
  cy.get('#ajaxLoading', {timeout: `${time}`}).should('not.be.visible')
  cy.wait(2000)
}

export const openSmartToolPageInCurrentPage = () => {
  cy.window().then((win) => {
    cy.stub(win, "open")
      .callsFake((url, target) => {
        // call the original `win.open` method
        // but pass the `_self` argument
        return win.open.wrappedMethod.call(win, url, "_self");
      })
      .as("open");
  });
  cy.contains("Smart Pathbook Tool").click({ force: true });
  cy.get("@open").should("have.been.calledOnce");
  //cy.wait(8000);
  cy.get('#id0', {timeout: 120000}).should('exist')

};

export const clickLinkByName = (linkName) => {
  cy.contains(`${linkName}`, {timeout: 60000}).click();
};

export const popAlert = () => {
  const alertStub = cy.stub();
  cy.on("window:alert", alertStub);
};

export const popConfirm = () => {
  const confirmStub = cy.stub();
  cy.on("window:confirm", confirmStub);
};

export const copyAndCompareExcel = () => {
  cy.wait(1000)
  //get downloaded file name to ensure the file is available
  cy.task('getDownloadFileName', {downloadsFolder}).then((filename) => {
    cy.log('downloading file:', filename)
  })
  //copy downloaded pathfile to generate_report folder and then compare the pathfile
  cy.task("copyFileToDirSync", {
    fromPath: `${downloadsFolder}/`,
    toPath: `${generatePath}/`,
  }).then((obj) => {
    let benchmarkFilePath = ""
    const generateFilePath = `${obj.generateFilePath}`;
    const diffFilePath = `${diffPath}/${obj.fileName}_${obj.currentTime}_diff${obj.extName}`;

    if (Cypress.env('isCnSite')) {
      benchmarkFilePath = `${benchmarkPath}/${obj.fileName}${obj.extName}`;
      cy.task("compareExcelFile", {
        benchmarkPath: benchmarkFilePath,
        generatePath: generateFilePath,
        diffPath: `${diffFilePath}`,
        isCnSite: Cypress.env('isCnSite')
      });
    } else {
      cy.task('isFileExists', `${benchmarkPath}/${obj.fileName}_pro${obj.extName}`).then((trueorfalse) => {
        cy.log("trueorflase", trueorfalse)
        if (trueorfalse) {
          benchmarkFilePath = `${benchmarkPath}/${obj.fileName}_pro${obj.extName}`
        } else {
          benchmarkFilePath = `${benchmarkPath}/${obj.fileName}${obj.extName}` 
        }

        cy.task("compareExcelFile", {
          benchmarkPath: benchmarkFilePath,
          generatePath: generateFilePath,
          diffPath: `${diffFilePath}`,
          isCnSite: Cypress.env('isCnSite')
        });
      })
    }

  });
};

export const copyAndCompareExcelByGivenFile = (benchFileName) => {
  cy.wait(1000)
  //get downloaded file name to ensure the file is available
  cy.task('getDownloadFileName', {downloadsFolder}).then((filename) => {
    cy.log('downloading file:', filename)
  })
  //copy downloaded pathfile to generate_report folder and then compare the pathfile
  cy.task("copyFileToDirSync", {
    fromPath: `${downloadsFolder}/`,
    toPath: `${generatePath}/`,
  }).then((obj) => {
    let benchmarkFilePath = ""
    const generateFilePath = `${obj.generateFilePath}`;
    //const diffFilePath = `${diffPath}/${obj.fileName}_${obj.currentTime}_diff${obj.extName}`;
    const diffFilePath = `${diffPath}/${benchFileName}_${obj.currentTime}_diff${obj.extName}`;

    if (Cypress.env('isCnSite')) {
      //benchmarkFilePath = `${benchmarkPath}/${obj.fileName}${obj.extName}`;
      benchmarkFilePath = `${benchmarkPath}/${benchFileName}${obj.extName}`;
      cy.task("compareExcelFile", {
        benchmarkPath: benchmarkFilePath,
        generatePath: generateFilePath,
        diffPath: `${diffFilePath}`,
        isCnSite: Cypress.env('isCnSite')
      });
    } else {
      cy.task('isFileExists', `${benchmarkPath}/${benchFileName}_pro${obj.extName}`).then((trueorfalse) => {
        cy.log("trueorflase", trueorfalse)
        if (trueorfalse) {
          benchmarkFilePath = `${benchmarkPath}/${benchFileName}_pro${obj.extName}`
        } else {
          benchmarkFilePath = `${benchmarkPath}/${benchFileName}${obj.extName}` 
        }

        cy.task("compareExcelFile", {
          benchmarkPath: benchmarkFilePath,
          generatePath: generateFilePath,
          diffPath: `${diffFilePath}`,
          isCnSite: Cypress.env('isCnSite')
        });
      })
    }

  });
};

export const getReportNameBySpanID = (spanID) => {
    
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
   switch(spanID) {
       case '#download-0-1':
           return 'EVE Report'
           break
       case '#download-0-6':
           return 'KRD Report'
           break
       case '#download-0-2':
           return 'EaR Report'
           break
       case '#download-0-104':
           return 'Gap Report'
           break
       case '#download-0-3':
           return 'Cahflow Report'
           break
       case '#download-0-15':
           return 'Loan portfolio Analytics Report'
           break
       case '#download-0-22':
           return 'Assumption Report'
           break
       case '#download-0-23':
           return 'DD Report'
           break
       case '#download-0-28':
           return 'Two Cycle Report'
           break
       case '#download-0-24':
           return 'Management Summary Report'
   }
}

export const checkReport = (reportList) => {
    reportList.forEach((spanID, index, list) => {
        cy.get('body').then(($body) => {
            if ($body.find(spanID).length) {
                cy.get(spanID).find('[title="EXCEL"]').click()
                //reportList.splice(index, 1)
                delete reportList[index]
                //console.log(`length9:${reportList[9]}`)
                //cy.wait(5000)
                copyAndCompareExcel()
            } else {
                console.log(`${getReportNameBySpanID(spanID)} was generating...`)
            }
        })
        cy.wait(1000)
    })
}
