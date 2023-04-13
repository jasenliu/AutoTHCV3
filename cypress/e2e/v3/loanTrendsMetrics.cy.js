import { login, clickLinkByName, selectBankByNameAndABA, selectBankCycle, copyAndCompareExcel } from "./utils"

describe('Loan Trends Metrics', () => {
    beforeEach(() => {
        if (Cypress.env('isCnSite')) {
            login(Cypress.env('v3_cn_username'), Cypress.env('v3_cn_password'))
        } else {
            login(Cypress.env('v3_com_username'), Cypress.env('v3_com_password'))
        }
        selectBankByNameAndABA('QTestBank3', '763')
        selectBankCycle('Dec 2022')
        clickLinkByName('Performance Insights') 
        clickLinkByName('Loan Trends Metrics')
        cy.wait(1000)
    })

    it('Loan Trends Metrics', () => {
        const Dec21_row_cells = ['12/31/2021', '158,872,185', '4.468', '72', '108.123', '107.646', '0.477', '0.013', '1.558', '1.148', '3.932', '114.774', '2.550', '0.14', '0.400', '0.003', '0.395', '0.291', '0.834', '720', '75.000', '6.519', '-4.658', '-43.648', '1.558', '1.662', '24.730', '2.946', '0.102', '8.769', '8.797', '4.529', '3.968']
        const Jun22_row_cells = ['6/30/2022', '2,858,397', '1.596', '15', '101.550', '101.541', '0.009', '-0.010', '0.071', '0.052', '0.474', '102.137', '1.737', '0.09', '0.606', '-0.000', '0.650', '0.479', '0.311', '650', '75.000', '0.118', '0.000', '0.053', '0.071', '0.778', '5.986', '0.314', '0.050', '0.148', '0.143', '0.612', '0.544']
        const Sep22_row_cells = ['9/30/2022', '192,535,619', '4.835', '76', '99.911', '99.539', '0.372', '-0.077', '1.046', '0.771', '2.563', '104.215', '5.678', '0.12', '1.848', '-0.021', '0.401', '0.295', '0.857', '720', '75.000', '3.307', '-2.790', '-13.261', '1.046', '1.613', '24.370', '2.326', '0.051', '13.857', '14.108', '3.431', '2.866']
        const Dec22_row_cells = ['12/31/2022', '193,708,745', '4.969', '75', '100.475', '100.102', '0.373', '-0.298', '1.076', '0.793', '2.582', '104.628', '5.788', '0.12', '2.634', '-0.083', '0.403', '0.297', '0.857', '720', '75.000', '3.334', '-2.623', '-13.437', '1.076', '1.619', '24.634', '2.271', '0.012', '14.087', '14.347', '3.391', '2.859']
        
        const bench_data = [Dec21_row_cells, Jun22_row_cells, Sep22_row_cells, Dec22_row_cells]

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