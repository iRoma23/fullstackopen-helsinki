import { Link, useNavigate } from 'react-router-dom'
import { useLoginDispatch, useLoginValue } from '../context/LoginContext'
import { useState } from 'react'

import IconBars from '../svg/IconBars'
import IconXMark from '../svg/IconXMark'

const Navbar = () => {
  const loginDispatch = useLoginDispatch()
  const user = useLoginValue()

  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    loginDispatch({ type: 'LOGOUT' })
    navigate('/')
  }

  return (
    <nav className='text-white bg-gray-900 border-gray-200 px-4 md:px-8 py-2.5'>
      <div className='container flex flex-wrap justify-between md:py-2 2xl:py-4'>
        <div className='flex items-center'>
          <div
            className='cursor-pointer md:hidden'
            onClick={() => setOpen(!open)}
          >
            {open
              ? <IconXMark />
              : <IconBars />}
          </div>
          <div className={`flex flex-col md:flex-row pb-8 md:pb-0 absolute md:static z-10 md:z-auto bg-gray-900 w-full left-0 md:w-auto pl-8 md:pl-0 transition-all duration-500 ease-in ${open ? 'top-11' : 'top-[-500px]'}`}>
            <div
              className='text-lg xl:text-2xl 2xl:text-3xl my-4 md:my-0 md:mr-6 hover:text-gray-300'
              onClick={() => setOpen(false)}
            >
              <Link to='/'>Blogs</Link>
            </div>
            <div
              className='text-lg xl:text-2xl 2xl:text-3xl my-4 md:my-0 md:mr-6 hover:text-gray-300'
              onClick={() => setOpen(false)}
            >
              <Link to='/users'>Users</Link>
            </div>
          </div>
        </div>
        <div className='z-20 flex items-center'>
          <span className='text-medium md:text-xl xl:text-2xl 2xl:text-3xl pr-2'>{user.name} logged in</span>
          <button
            className='bg-violet-700 hover:bg-violet-800 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded active:bg-violet-900 focus:outline-none focus:ring focus:ring-violet-300'
            onClick={handleLogout}
          >
            logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
