import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel } from "./utils"

describe('Loan Trends Metrics', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }
        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Jun 2022')
        clickLinkByName('Performance Insights') 
        clickLinkByName('Loan Trends Metrics')
        cy.wait(1000)
    })

    it('Loan Trends Metrics', () => {
        const fist_row_cells = ['12/31/2021', '151,436,591', '4.595', '91', '106.127', '105.764', '0.363', '0.006', '1.125', '0.829', '2.764', '110.852', '2.528', '0.15', '0.353', '0.002', '0.419', '0.309', '0.864', '720', '75.000', '4.380', '-1.774', '-12.742', '1.125', '1.778', '24.416', '2.043', '-0.321', '19.646', '18.369', '3.132', '2.870']
        const second_row_cells = ['6/30/2022', '2,858,397', '1.596', '15', '101.550', '101.541', '0.009', '-0.010', '0.071', '0.052', '0.474', '102.137', '1.737', '0.09', '0.605', '-0.000', '0.650', '0.479', '0.311', '650', '75.000', '0.118', '0.000', '0.053', '0.071', '0.778', '5.986', '0.314', '0.050', '0.148', '0.143', '0.612', '0.544']
        const bench_data = [fist_row_cells, second_row_cells]

        //get cell data from table
        cy.get('table.lcentral_fulltd tbody tr').then(($rows) => {
            $rows.each((index, $row) => {
                const cells = Cypress._.map($row.children, 'innerText')
                cy.log(cells)
                expect(cells).to.deep.equal(bench_data[index])
            })
        })
    })
})