import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> create a blog, the like button is clicked twince', async () => {
  const createNote = jest.fn()
  const user = userEvent.setup()
  const newBlog = {
    title: 'title test',
    author: 'author test',
    url: 'url test'
  }

  render(<BlogForm createBlog={createNote} />)

  const [titleInput, authorInput, urlInput] = screen.getAllByRole('textbox')
  const sendButton = screen.getByRole('button', { name: 'create' })

  await user.type(titleInput, newBlog.title)
  await user.type(authorInput, newBlog.author)
  await user.type(urlInput, newBlog.url)
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0]).toEqual(newBlog)
})
