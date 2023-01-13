const path = require('path')

const downloadsFolder = Cypress.config('downloadsFolder')
const fixturesFolder = Cypress.config('fixturesFolder')
const benchmarkPath = path.join(fixturesFolder.replace(/\\/g, '/'), 'report/benchmark_report/smart_tool')
const generatePath = path.join(fixturesFolder.replace(/\\/g, '/'), 'report/generate_report')
const diffPath = path.join(fixturesFolder.replace(/\\/g, '/'), 'result')

export const login = (username, password) => {
  cy.visit("/Account/Login");
  cy.get("#Login").type(`${username}`);
  cy.get("#Password").type(`${password}`);
  cy.get("#rm_submit_btn").click();
  cy.wait(5000);
};

export const selectBankByNameAndABA = (bankName, abaNumber) => {
  cy.get(".nirastateF").click({ force: true });
  cy.get("#abaIdDOM").type(`${abaNumber}`);
  cy.get("#searchDOM").click();
  cy.wait(2000)
  cy.get(`[title=${bankName}]`).click();
  cy.wait(3000);
};

export const selectBankCycle = (bankCycle) => {
  cy.get("#app > section > div > div > span > i").click();
  cy.get(".el-icon--right").last().click(); //get total 2 elements and the second is needed
  cy.contains(`${bankCycle}`).click();
  cy.wait(2000);
};

export const BSISThreeNext = () => {
  cy.get('[value="Next"]').click();
  cy.get('[value="Next"]').click();
  cy.get('[value="Next"]').click();
};

export const doubleClickNext = () => {
  cy.wait(5000);
  cy.get('[value="next2"]').click({ force: true });
  cy.wait(2000)
  cy.get('[value="next3"]').click({ force: true });
  cy.wait(2000)
};

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
  cy.wait(8000);
};

export const clickLinkByName = (linkName) => {
  cy.contains(`${linkName}`).click({ force: true });
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
  //copy downloaded pathfile to generate_report folder and then compare the pathfile
  cy.task("copyFileToDirSync", {
    fromPath: `${downloadsFolder}/`,
    toPath: `${generatePath}/`,
  }).then((obj) => {
    const benchmarkFilePath = `${benchmarkPath}/${obj.fileName}${obj.extName}`;
    const generateFilePath = `${obj.generateFilePath}`;
    const diffFilePath = `${diffPath}/${obj.fileName}_${obj.currentTime}_diff${obj.extName}`;

    cy.task("compareExcelFile", {
      benchmarkPath: benchmarkFilePath,
      generatePath: generateFilePath,
      diffPath: `${diffFilePath}`,
    });
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
                delete reportList[index]
                console.log(`length9:${reportList[9]}`)
                cy.wait(5000)
                copyAndCompareExcel()
            } else {
                console.log(`${getReportNameBySpanID(spanID)} was generating...`)
            }
        })
        cy.wait(3000)
    })
}
