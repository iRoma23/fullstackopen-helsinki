import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/loginReducer'
import { setNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'

const LoginForm = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await dispatch(login(username, password))
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
    } catch (exception) {
      dispatch(setNotification({ msg: exception.response.data.error, success: false }, 5))
    }

    setUsername('')
    setPassword('')
  }

  const handleUsernameChange = event => setUsername(event.target.value)
  const handlePasswordChange = event => setPassword(event.target.value)

  return (
    <div>
      <div className='flex flex-col items-center p-4'>
        <h2 className='text-2xl text-white my-2'>Log in to application</h2>
        <form className='my-2' onSubmit={handleSubmit}>
          <div className='my-2'>
            <span className='text-base font-medium text-white p-2'>
              username
            </span>
            <input
              type='text'
              value={username}
              name='username'
              onChange={handleUsernameChange}
              className='py-1 px-2'
            />
          </div>
          <div className='my-2'>
            <span className='text-base font-medium text-white p-2'>
              password
            </span>
            <input
              type='password'
              value={password}
              name='password'
              onChange={handlePasswordChange}
              className='py-1 px-2'
            />
          </div>
          <div className='flex justify-center my-2'>
            <button className='bg-violet-700 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded active:bg-violet-900 focus:outline-none focus:ring focus:ring-violet-300' type='submit'>login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
