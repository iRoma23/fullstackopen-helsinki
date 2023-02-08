import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const handleSubmit = event => {
    event.preventDefault()
    createBlog(newBlog)

    setNewBlog({
      title: '',
      author: '',
      url: ''
    })
  }

  const handleChange = event => {
    const { value, name } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            type='text'
            value={newBlog.title}
            name='title'
            onChange={handleChange}
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={newBlog.author}
            name='author'
            onChange={handleChange}
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={newBlog.url}
            name='url'
            onChange={handleChange}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default BlogForm
