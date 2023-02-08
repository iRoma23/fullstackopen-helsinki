import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: '12 rules for life',
    author: 'Jordan Peterson',
    url: 'https://www.jordanbpeterson.com/',
    likes: 0,
    user: {
      username: 'romadev',
      name: 'Roma dev'
    },
    id: 1
  }
  const user = userEvent.setup()
  const mockHandler = jest.fn()

  const blogElement = () => render(<Blog blog={blog} increaseLikes={mockHandler} />)

  test("renders the blog's title and author, but does not render url and likes", () => {
    blogElement()

    const titleElement = screen.getByText('12 rules for life')
    expect(titleElement).toBeDefined()

    const authorElement = screen.getByText('Jordan Peterson')
    expect(authorElement).toBeDefined()

    const urlElement = screen.queryByText('https://www.jordanbpeterson.com/')
    expect(urlElement).toBeNull()

    const likes = screen.queryByText('likes')
    expect(likes).toBeNull()
  })

  test("renders the blog's url and number of likes when 'view' button is clicked", async () => {
    blogElement()

    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.getByText('https://www.jordanbpeterson.com/')
    expect(urlElement).toBeDefined()

    const likeElement = screen.getByText('likes', { exact: false })
    expect(likeElement).toBeDefined()
  })

  test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
    blogElement()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
