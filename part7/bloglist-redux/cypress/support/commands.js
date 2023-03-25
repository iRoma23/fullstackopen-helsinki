Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
    username, password
  }).then(({ body }) => {
    window.localStorage.setItem('loggedBloglistUser', JSON.stringify(body))
    cy.visit('')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.request({
    url: `${Cypress.env('BACKEND')}/blogs`,
    method: 'POST',
    body: { title, author, url },
    headers: {
      Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('loggedBloglistUser')).token}`
    }
  })

  cy.visit('')
})

Cypress.Commands.add('blogButton', (blogButton) => {
  cy.get('span')
    .contains(blogButton)
    .parent()
    .find('button')
})
