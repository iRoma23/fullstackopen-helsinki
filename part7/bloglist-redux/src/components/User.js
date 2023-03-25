import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const User = () => {
  const { id } = useParams()

  const users = useSelector(state => state.users)
  const user = users.find(user => user.id === id)

  if (!user) {
    return null
  }

  return (
    <div className='flex flex-col px-8 md:px-16 lg:px-32'>
      <h2 className='self-center text-lg md:text-2xl text-white font-medium md:font-semibold mb-1 md:mb-2'>{user.name}</h2>
      <h3 className='text-base md:text-lg text-white font-medium mb-1 md:mb-2'>Added blogs</h3>
      <ul>
        {user.blogs.map(blog =>
          <li
            className='text-base md:text-lg text-gray-800 font-medium ml-2 md:ml-4 p-1 md:p-2'
            key={blog.id}
          >
            {blog.title}
          </li>
        )}
      </ul>
    </div>
  )
}

export default User
