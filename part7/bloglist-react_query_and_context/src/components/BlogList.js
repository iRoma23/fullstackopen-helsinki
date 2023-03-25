import { useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'

const BlogList = () => {
  const queryClient = useQueryClient()
  const sortedBlogs = [...queryClient.getQueryData('blogs')].sort((a, b) => b.likes - a.likes)

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center mt-8'>
      {sortedBlogs.map(blog =>
        <div key={blog.id} className='bg-gray-800 hover:bg-gray-700 text-white h-48 hover:h-52 w-48 hover:w-52 rounded-lg'>
          <Link to={`/blogs/${blog.id}`}>
            <div className='flex justify-center items-center h-3/5 text-center border-b-2 px-4'>
              {blog.title}
            </div>
            <div className='flex justify-center items-center h-2/5 text-center break-all'>
              {blog.author}
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}

export default BlogList
