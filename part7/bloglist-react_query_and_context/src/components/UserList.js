import { useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'

const UserList = () => {
  const queryClient = useQueryClient()
  const users = [...queryClient.getQueryData('users')].sort((a, b) => b.blogs.length - a.blogs.length)

  return (
    <div className='px-8 md:px-16 lg:px-32'>
      <h2 className='text-lg md:text-2xl text-white font-medium md:font-semibold mb-1 md:mb-2'>Users</h2>
      <div className='flex justify-center'>
        <table className=''>
          <thead>
            <tr>
              <th />
              <th className='text-white md:text-xl '>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user =>
              <tr key={user.id}>
                <td className='font-medium text-base md:text-lg hover:text-xl text-gray-800 hover:text-gray-300'>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td className='font-medium text-base md:text-lg text-center text-gray-800'>
                  {user.blogs.length}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserList
