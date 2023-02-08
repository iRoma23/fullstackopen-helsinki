import { useState } from 'react'

const Blog = ({ blog, increaseLikes, removeBlog, username }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(!visible)

  const handleLikes = () => {
    const blogToUpdate = {
      likes: blog.likes + 1
    }
    increaseLikes(blog.id, blogToUpdate)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id, blog.title)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div className='blog' style={blogStyle}>
      <span>{blog.title}</span>
      <span>{blog.author}</span>
      <button onClick={toggleVisibility}>
        {visible ? 'hide' : 'view'}
      </button>
      {visible
        ? (
          <>
            <div>{blog.url}</div>
            <div>
              <span>likes {blog.likes}</span>
              <button onClick={handleLikes}>like</button>
            </div>
            <div>{blog.user.name}</div>
            {username === blog.user.username
              ? <button onClick={handleDelete}>remove</button>
              : null}
          </>
          )
        : null}
    </div>
  )
}

export default Blog
