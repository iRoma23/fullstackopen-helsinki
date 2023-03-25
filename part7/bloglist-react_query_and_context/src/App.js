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
import userService from './services/users'

// react-query
import { useQueries /*, useQuery */ } from 'react-query'
import { useLoginDispatch, useLoginValue } from './context/LoginContext'

// router
import { Route, Routes } from 'react-router-dom'

const App = () => {
  const [blogsQuery, usersQuery] = useQueries([
    { queryKey: ['blogs'], queryFn: blogService.getAll },
    { queryKey: ['users'], queryFn: userService.getAll }
  ])

  const loginDispatch = useLoginDispatch()
  const user = useLoginValue()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      loginDispatch({
        type: 'LOGIN',
        payload: loggedUser
      })
      blogService.setToken(loggedUser.token)
    }
  }, [])

  if (blogsQuery.isLoading) {
    return <div>loading data...</div>
  }
  if (usersQuery.isLoading) {
    return <div>loading data...</div>
  }

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
