import { useEffect } from 'react'

// components
import Navbar from './components/Navbar'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import User from './components/User'
import UserList from './components/UserList'
import Blog from './components/Blog'
import Home from './pages/Home'

// services
import blogService from './services/blogs'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/loginReducer'
import { initializeUsers } from './reducers/userReducer'

// router
import { Routes, Route } from 'react-router-dom'

const App = () => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.login)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      dispatch(setUser(loggedUser))
      blogService.setToken(loggedUser.token)
    }
  }, [dispatch])

  return (
    <>
      {user === null
        ? (
          <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-screen flex flex-col'>
            <Notification />
            <LoginForm />
          </div>
          )
        : (
          <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen'>
            <Navbar />
            <Notification />
            <h2 className='text-2xl md:text-4xl font-medium md:font-semibold text-white my-2 md:my-4 px-8 md:px-16 lg:px-32'>blogs app</h2>
            <Routes>
              <Route path='/users/:id' element={<User />} />
              <Route path='/users' element={<UserList />} />
              <Route path='/blogs/:id' element={<Blog />} />
              <Route path='/' element={<Home />} />
            </Routes>
          </div>
          )}
    </>
  )
}

export default App
