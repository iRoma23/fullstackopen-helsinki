import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ msg: null, success: null })

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      notifier(exception.response.data.error, false)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const blog = await blogService.create(blogObject)
      setBlogs(blogs.concat(blog))
      notifier(`a new blog ${blog.title} by ${blog.author} is added`, true)
    } catch (exception) {
      notifier(exception.response.data.error, false)
    }
  }

  const updateLikes = async (id, changedBlog) => {
    try {
      const updatedLikes = await blogService.update(id, changedBlog)
      console.log(updatedLikes)
      const updatedBlogs = blogs.map(blog => blog.id !== id ? blog : updatedLikes)
      setBlogs(updatedBlogs)
    } catch (exception) {
      notifier(exception.response.data.error, false)
    }
  }

  const deleteBlog = async (id, title) => {
    try {
      await blogService.remove(id)
      const updatedBlogs = blogs.filter(blog => blog.id !== id)
      setBlogs(updatedBlogs)
      notifier(`${title} blog is removed`, true)
    } catch (exception) {
      notifier(exception.response.data.error, false)
    }
  }

  const notifier = (msg, success) => {
    const msgObject = {
      msg,
      success
    }
    setMessage(msgObject)
    setTimeout(() => {
      setMessage({ msg: null, success: null })
    }, 5000)
  }

  return (
    <>
      {user === null
        ? (
          <div>
            <h2>Log in to application</h2>
            <Notification message={message} />
            <LoginForm handleLogin={handleLogin} />
          </div>
          )
        : (
          <div>
            <h2>blogs</h2>
            <Notification message={message} />
            <div>
              <span>{user.name} logged in</span>
              <button onClick={handleLogout}>logout</button>
            </div>
            <Togglable buttonLabel='new blog' ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>
            {blogs
              .sort((a, b) => b.likes - a.likes)
              .map(blog =>
                <Blog
                  key={blog.id}
                  blog={blog}
                  increaseLikes={updateLikes}
                  removeBlog={deleteBlog}
                  username={user.username}
                />
              )}
          </div>
          )}
    </>
  )
}

export default App
