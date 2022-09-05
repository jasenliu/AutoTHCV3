const { defineConfig } = require("cypress");

const fs = require('fs')
const path = require('path')
const xlsxPopulate = require('xlsx-populate')

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
  e2e: {
    setupNodeEvents(on, config) {
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
        copyFileToDirSync({ fromPath, toPath }) {
          const currentTime = getCurrentTime()
          let generateFilePath = ''
          let fileName = ''
          let extName = ''
          fs.readdirSync(fromPath).forEach(file => {
            fileName = path.basename(file, path.extname(file))
            extName = path.extname(file)
            generateFilePath  = `${toPath}${fileName}_${currentTime}${extName}`
            const srcFileName = `${fromPath}${file}`
            fs.copyFileSync(srcFileName, generateFilePath)
            //console.log(`aaaaa:${file}`)
          })

          return {generateFilePath, currentTime, fileName, extName}

        },
        compareExcelFile({benchmarkPath, generatePath, diffPath}) {
          let isDiff = false
          xlsxPopulate.fromFileAsync(benchmarkPath).then(benBook => {
            xlsxPopulate.fromFileAsync(generatePath).then(genBook => {
                benBook.sheets().forEach(function(sheet, sheetId, arrSheet) {
                    const genSheet = genBook.sheet(sheet.name())
                    console.log(`sheetName:${sheet.name()}`)
                    sheet._rows.forEach(function(row) {
                        const genRow = genSheet.row(row.rowNumber())
                        row._cells.forEach(function(cell) {
                            const genCell = genRow.cell(cell.columnNumber()) 
                            if(cell.value() != genCell.value()) {
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
                    const data = { reportName: `${path.basename(benchmarkPath)}`, result: 'diff'}
                    fs.writeFileSync('cypress/fixtures/result/result.json', JSON.stringify(data))
                } else {
                    console.log('the compared two files were the same')
                    const data = { reportName: `${path.basename(benchmarkPath)}`, result: 'same'}
                    fs.writeFileSync('cypress/fixtures/result/result.json', JSON.stringify(data))
                    
                }
            })
        })
        return null
      },


      })
      // implement node event listeners here
    },
    baseUrl: 'https://thcdecisions.cn/tlink',
    viewportWidth: 1475,
    viewportHeight: 826,
  },
});
