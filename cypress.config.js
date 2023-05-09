const { defineConfig } = require("cypress");

const fs = require('fs')
const path = require('path')
const xlsxPopulate = require('xlsx-populate')
const dotenv = require("dotenv")
const chokidar = require('chokidar')

dotenv.config({ path: ".env.local "})
dotenv.config()

function fix2Number(str) {
  return [0, str].join('').slice(-2)
}

function getCurrentTime() {
  const currentTime = new Date()
  const year = fix2Number(currentTime.getFullYear())
  const month = fix2Number(currentTime.getMonth() + 1)
  const day = fix2Number(currentTime.getDate())
  const hours = fix2Number(currentTime.getHours())
  const minutes = fix2Number(currentTime.getMinutes())
  const seconds = fix2Number(currentTime.getSeconds())
  const formatTime = `${year}${month}${day}_${hours}${minutes}${seconds}`
  return formatTime
}

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      on('task', {
          copyFileToDir({ fromPath, toPath }) {
            const currentTime = getCurrentTime()
            let generateFileName = '123'
            fs.readdir(fromPath, (err, files) => {
                files.forEach(function(file, index, fileList) {
                    const fileName = path.basename(file, path.extname(file))
                    const extName = path.extname(file)
                    generateFileName = `${toPath}${fileName}_${currentTime}${extName}`
                    const srcFileName = `${fromPath}${file}`
                    fs.copyFile(srcFileName, generateFileName, () => {})

                    console.log(file)
                })
            })
            return generateFileName
          },
          getDownloadFileName({downloadsFolder}){
            return new Promise((resolve, reject) => {
              /*
              const watcher = fs.watch(downloadsFolder, (eventType, filename) => {
                if (eventType === 'rename' && !filename.endsWith('.crdownload')) {
                  resolve(filename)
                  watcher.close()
                }
              })
              */
              const ck = chokidar.watch(downloadsFolder).on('add', (filename) => {
                if (!filename.endsWith('.crdownload')) {
                  resolve(filename)
                  ck.close()
                }
              })
              setTimeout(reject, 30000)
            })

          },
          downloadsReady: ({downloadsFolder}) => {
            return fs.readdirSync(downloadsFolder)
          },
          copyFileToDirSync({ fromPath, toPath }) {
            const currentTime = getCurrentTime()
            let generateFilePath = ''
            let fileName = ''
            let extName = ''
            fs.readdirSync(fromPath).forEach(file => {
              fileName = path.basename(file, path.extname(file))
              //incomeSimulation
              if (fileName.includes('OASIncome(')) {
                fileName = 'OASIncome'
              }

              //performanceAttribution
              if (fileName.includes('loans_bonds_0421_sample(')) {
                fileName = 'loans_bonds_0421_sample-ReturnAttribution'
              }

              //investmentManagement security tab
              if (fileName.includes('single_security_analysis_v6')) {
                fileName = 'single_security_analysis_v6'
              }

              //investmentManagement Performance Attribution tab
              if (fileName.includes('QTestBank3(20221231)')) {
                fileName = 'QTestBank3(20221231)-ReturnAttribution'
              }

              extName = path.extname(file)
              generateFilePath  = `${toPath}${fileName}_${currentTime}${extName}`
              const srcFileName = `${fromPath}${file}`
              fs.copyFileSync(srcFileName, generateFilePath)
              fs.rmSync(srcFileName)
              //console.log(`aaaaa:${file}`)
            })

            return {generateFilePath, currentTime, fileName, extName}

          },
          isFileExists(fileName) {
            return fs.existsSync(fileName)
          },
          compareExcelFile({benchmarkPath, generatePath, diffPath, isCnSite }) {
            let isDiff = false
            let site = ""
            if (isCnSite) {
              site = "dev.thcdecisions.cn"
            } else {
              site = "thcdecisions.com"
            }
            xlsxPopulate.fromFileAsync(benchmarkPath).then(benBook => {
              xlsxPopulate.fromFileAsync(generatePath).then(genBook => {
                  console.log(generatePath)
                  benBook.sheets().forEach(function(sheet, sheetId, arrSheet) {
                      const genSheet = genBook.sheet(sheet.name())
                      console.log(`sheetName:${sheet.name()}`)
                      sheet._rows.forEach(function(row) {
                          const genRow = genSheet.row(row.rowNumber())
                          row._cells.forEach(function(cell) {
                              const genCell = genRow.cell(cell.columnNumber()) 
                              if (cell.find('Printed on')) {
                                return
                              }
                              if (cell.style("strikethrough")) {
                                return
                              }
                              if (cell.value() != genCell.value()) {
                                  isDiff = true
                                  genCell.value(`expected:${cell.value()}, actual:${genCell.value()}`)
                                  genCell.style("fontColor", "ff0000")
                                  console.log(genCell.value())
                              }
                          })
                      })
                  })
                  if (isDiff) {
                      genBook.toFileAsync(diffPath)
                      const data = { site: site, date: `${getCurrentTime()}`, reportName: `${path.basename(benchmarkPath)}`, result: 'diff'}
                      //fs.writeFileSync('cypress/fixtures/result/result.json', JSON.stringify(data))
                      fs.appendFileSync('cypress/fixtures/result/result.json', '\n')
                      fs.appendFileSync('cypress/fixtures/result/result.json', JSON.stringify(data))
                  } else {
                      console.log('the compared two files were the same')
                      const data = { site: site, date: `${getCurrentTime()}`, reportName: `${path.basename(benchmarkPath)}`, result: 'same'}
                      //fs.writeFileSync('cypress/fixtures/result/result.json', JSON.stringify(data))
                      fs.appendFileSync('cypress/fixtures/result/result.json', '\n')
                      fs.appendFileSync('cypress/fixtures/result/result.json', JSON.stringify(data))
                      
                  }
              })
          })
          return null
        },


        })
      // implement node event listeners here
    },
    baseUrl: 'https://dev.thcdecisions.cn',
    viewportWidth: 1455,
    viewportHeight: 812,
    chromeWebSecurity: false,
    videoCompression: false,
    defaultCommandTimeout: 10000,
    //excludeSpecPattern: 'cypress/e2e/v3/performanceAttribution.cy.js',
    retries: {
      "runMode": 2
    }
  },
  env: {
    v3_cn_username: process.env.V3_CN_USERNAME,
    v3_cn_password: process.env.V3_CN_PASSWORD,
    v3_com_username: process.env.V3_COM_USERNAME,
    v3_com_password: process.env.V3_COM_PASSWORD,
    v3_com_baseUrl: 'https://thcdecisions.com',
    isCnSite: true,

    v2_daily_username: process.env.V2_DAILY_USERNAME,
    v2_daily_password: process.env.V2_DAILY_PASSWORD,
    v2_username: process.env.V2_USERNAME,
    v2_password: process.env.V2_PASSWORD,
    v2_pro_daily_username: process.env.V2_PRO_DAILY_USERNAME,
    V2_pro_daily_password: process.env.V2_PRO_DAILY_PASSWORD,

  }
});
