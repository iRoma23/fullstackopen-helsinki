describe('Blog app', () => {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      username: 'romadev',
      password: '1234',
      name: 'Roma Developer'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.get('button')
      .should('contain', 'login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('form')
        .find('input[name=username]')
        .type('romadev')
      cy.get('form')
        .find('input[name=password]')
        .type('1234')
      cy.get('form')
        .find('button[type=submit]')
        .should('contain', 'login')
        .click()

      cy.contains('Roma Developer logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('form')
        .find('input[name=username]')
        .type('romadev')
      cy.get('form')
        .find('input[name=password]')
        .type('wrongpassword')
      cy.get('form')
        .find('button[type=submit]')
        .should('contain', 'login')
        .click()

      cy.get('.failed')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Roma Developer logged in')
    })
  })

  describe('Blogg app', function () {
    beforeEach(function () {
      cy.login({ username: 'romadev', password: '1234' })
    })

    it('A blog can be created', function () {
      cy.get('button')
        .contains('new blog')
        .click()

      cy.get('form')
        .find('input[name=title]')
        .type('12 rules for life')
      cy.get('form')
        .find('input[name=author]')
        .type('Jordan Peterson')
      cy.get('form')
        .find('input[name=url]')
        .type('https://www.jordanbpeterson.com/')
      cy.get('form')
        .find('button[type=submit]')
        .should('contain', 'create')
        .click()

      cy.get('.successful')
        .should('contain', 'a new blog 12 rules for life by Jordan Peterson is added')
      cy.get('button')
        .contains('view')
        .parent()
        .should('contain', '12 rules for life')
    })

    describe('and several notes exist', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'first title', author: 'first author', url: 'first url' })
        cy.createBlog({ title: 'second title', author: 'second author', url: 'second url' })
        cy.createBlog({ title: 'third title', author: 'third author', url: 'third url' })
      })

      it('user who create a blog can click like button', function () {
        cy.get('span')
          .contains('second title')
          .parent()
          .find('button')
          .as('theButton')

        cy.get('@theButton')
          .contains('view')
          .click()
        cy.get('@theButton')
          .contains('like')
          .click()

        cy.contains('likes 1')
      })

      it('user who create a blog can delete it', function () {
        cy.get('span')
          .contains('third title')
          .parent()
          .find('button')
          .as('theButton')

        cy.get('@theButton')
          .contains('view')
          .click()
        cy.get('@theButton')
          .contains('remove')
          .click()

        cy.get('.successful')
          .should('contain', 'third title blog is removed')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
          .and('have.css', 'border-style', 'solid')

        cy.get('html').wait(5000).should('not.contain', 'third title')
      })

      describe('logout, create a new user and login', function () {
        beforeEach(function () {
          cy.get('button')
            .contains('logout')
            .click()

          const user = {
            username: 'otheruser',
            password: '1234',
            name: 'Other User'
          }
          cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
          cy.login({ username: 'otheruser', password: '1234' })
        })

        it("user who don'tcreate a blog can click like button", function () {
          cy.get('span')
            .contains('first title')
            .parent()
            .find('button')
            .as('theButton')

          cy.get('@theButton')
            .contains('view')
            .click()
          cy.get('@theButton')
            .contains('like')
            .click()

          cy.contains('likes 1')
        })

        it("user who don't create the blog can not delete it", function () {
          cy.get('span')
            .contains('third title')
            .parent()
            .find('button')
            .as('theButton')

          cy.get('@theButton')
            .contains('view')
            .click()

          cy.get('@theButton')
            .should('not.contain', 'remove')
        })
      })

      it.only('blogs with more likes being first', function () {
        cy.blogButton('first title').as('firstButton')
        cy.blogButton('second title').as('secondButton')
        cy.blogButton('third title').as('thirdButton')

        cy.get('@firstButton')
          .contains('view')
          .click()
        cy.get('@firstButton')
          .contains('like')
          .click()

        cy.get('@secondButton')
          .contains('view')
          .click()
        cy.get('@secondButton')
          .contains('like')
          .click().wait(1000)
          .click().wait(1000)
          .click().wait(1000)
          .click().wait(1000)
          .click()

        cy.get('@thirdButton')
          .contains('view')
          .click()
        cy.get('@thirdButton')
          .contains('like')
          .click().wait(1000)
          .click().wait(1000)
          .click()

        cy.get('.blog').eq(0).should('contain', 'second title')
        cy.get('.blog').eq(1).should('contain', 'third title')
        cy.get('.blog').eq(2).should('contain', 'first title')
      })
    })
  })
})
