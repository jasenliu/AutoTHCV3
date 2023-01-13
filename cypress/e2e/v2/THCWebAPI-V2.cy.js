describe('THCWebAPI test', () => {
    it('test site gettoken api', () => {
        cy.request('https://test.thchf.com.cn/thcapi/token/gettoken?username=bd&password=1')
          .then((resp) => {
            expect(resp.status).eq(200)
            expect(resp).to.have.property('duration')
            expect(resp.body).to.contain('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUSEMiLCJVc2VyIjp7IklkIjozODcsIk5hbWUiOiIiLCJMb2dpbiI6ImJkIiwiUGVybWlzc2lvbiI6NywiRU1haWwiOiIiLCJTdGFydERUIjoiMjAxNC0xMS0xMVQwMDowMDowMCIsIkV4cGlyZURheXMiOjEwMDAwLCJFeHBpcnlEYXRlVGltZSI6IjIwNDItMDMtMjlUMDA6MDA6MDAifX0.ZlrabX6u-lLU1QFw451FJlksZHID8FknuT5r54vShq4')
          })
    })

    it('test site thcapi/qc data_type=item', () => {
        cy.request({
            url: 'https://test.thchf.com.cn/thcapi/qc?date_from=202103&date_to=202203&data_type=item&data_format=json',
            auth: {
                'bearer': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUSEMiLCJVc2VyIjp7IklkIjozODcsIk5hbWUiOiIiLCJMb2dpbiI6ImJkIiwiUGVybWlzc2lvbiI6NywiRU1haWwiOiIiLCJTdGFydERUIjoiMjAxNC0xMS0xMVQwMDowMDowMCIsIkV4cGlyZURheXMiOjEwMDAwLCJFeHBpcnlEYXRlVGltZSI6IjIwNDItMDMtMjlUMDA6MDA6MDAifX0.ZlrabX6u-lLU1QFw451FJlksZHID8FknuT5r54vShq4'
            }
        })
          .its('body')
          .should('have.length', 92)

    })

    it('test site thcapi/qc data_type=avg', () => {
        cy.request({
            url: 'https://test.thchf.com.cn/thcapi/qc?date_from=202103&date_to=202203&data_type=avg&data_format=json',
            auth: {
                'bearer': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUSEMiLCJVc2VyIjp7IklkIjozODcsIk5hbWUiOiIiLCJMb2dpbiI6ImJkIiwiUGVybWlzc2lvbiI6NywiRU1haWwiOiIiLCJTdGFydERUIjoiMjAxNC0xMS0xMVQwMDowMDowMCIsIkV4cGlyZURheXMiOjEwMDAwLCJFeHBpcnlEYXRlVGltZSI6IjIwNDItMDMtMjlUMDA6MDA6MDAifX0.ZlrabX6u-lLU1QFw451FJlksZHID8FknuT5r54vShq4'
            }
        })
          .its('body')
          .should('have.length', 5)
         
    })

    it('test site thcapi/call data_type=item', () => {
        cy.request({
            url: 'https://test.thchf.com.cn/thcapi/call?date_from=202103&date_to=202203&data_type=item&frequency=q&data_format=json',
            auth: {
                'bearer': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUSEMiLCJVc2VyIjp7IklkIjozODcsIk5hbWUiOiIiLCJMb2dpbiI6ImJkIiwiUGVybWlzc2lvbiI6NywiRU1haWwiOiIiLCJTdGFydERUIjoiMjAxNC0xMS0xMVQwMDowMDowMCIsIkV4cGlyZURheXMiOjEwMDAwLCJFeHBpcnlEYXRlVGltZSI6IjIwNDItMDMtMjlUMDA6MDA6MDAifX0.ZlrabX6u-lLU1QFw451FJlksZHID8FknuT5r54vShq4'
            },
            method: 'POST',
            body: {
                "Field": [
                    "BSCASH",
                    "BSLOAN",
                    "BSINVESTMENT",
                    "RCON2210",
                    "RCON6810",
                    "RCON0352",
                    "UBPRE001",
                    "UBPRE002",
                    "UBPRE003",
                    "UBPRE013",
                    "UBPRE014",
                    "UBPRE015",
                    "UBPRE688",
                    "UBPRF900",
                    "UBPRF901"
                ]
            }
        })
          .its('body')
          .should('have.length', 5003)

    })

    it('test site thcapi/call data_type=avg', () => {
        cy.request({
            url: 'https://test.thchf.com.cn/thcapi/call?date_from=202103&date_to=202203&data_type=avg&frequency=q&data_format=json',
            auth: {
                'bearer': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUSEMiLCJVc2VyIjp7IklkIjozODcsIk5hbWUiOiIiLCJMb2dpbiI6ImJkIiwiUGVybWlzc2lvbiI6NywiRU1haWwiOiIiLCJTdGFydERUIjoiMjAxNC0xMS0xMVQwMDowMDowMCIsIkV4cGlyZURheXMiOjEwMDAwLCJFeHBpcnlEYXRlVGltZSI6IjIwNDItMDMtMjlUMDA6MDA6MDAifX0.ZlrabX6u-lLU1QFw451FJlksZHID8FknuT5r54vShq4'
            },
            method: 'POST',
            body: {
                "Field": [
                    "BSCASH",
                    "BSLOAN",
                    "BSINVESTMENT",
                    "RCON2210",
                    "RCON6810",
                    "RCON0352",
                    "UBPRE001",
                    "UBPRE002",
                    "UBPRE003",
                    "UBPRE013",
                    "UBPRE014",
                    "UBPRE015",
                    "UBPRE688",
                    "UBPRF900",
                    "UBPRF901"
                ]
            }
        })
          .its('body')
          .should('have.length', 5)
         
    })

})