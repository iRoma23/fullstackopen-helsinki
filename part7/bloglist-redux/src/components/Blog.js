import { useDispatch, useSelector } from 'react-redux'
import { deleteBlog, updateBlog, addComment } from '../reducers/blogReducer'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

const Blog = () => {
  const dispacth = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const blogs = useSelector(state => state.blogs)
  const blog = blogs.find(blogs => blogs.id === id)

  const username = useSelector(state => state.login.username)

  const [newComment, setNewComment] = useState('')

  const handleLikes = () => {
    const blogToUpdate = { ...blog, likes: blog.likes + 1 }
    dispacth(updateBlog(blogToUpdate))
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispacth(deleteBlog(blog))
      navigate('/')
    }
  }

  const handleChange = event => {
    const { value } = event.target
    setNewComment(value)
  }

  const handleSubmit = event => {
    event.preventDefault()
    dispacth(addComment(id, newComment))
    setNewComment('')
  }

  if (!blog) {
    return null
  }

  return (
    <div className='flex flex-col px-8 md:px-16 lg:px-32'>
      <div className='flex flex-col place-self-center md:max-w-md'>
        <h3 className='text-lg text-gray-300 font-medium mb-1 md:mb-2'>
          {blog.title}
        </h3>
        <h3 className='text-lg text-gray-300 font-medium mb-1 md:mb-2'>
          {blog.author}
        </h3>
        <div className='flex mb-1 md:mb-2'>
          <span className='self-center text-lg text-gray-300 font-medium'>Likes: {blog.likes}</span>
          <div className='mx-3'>
            <button
              className='bg-violet-700 hover:bg-violet-800 text-white font-bold py-1 px-2 rounded active:bg-violet-900 focus:outline-none focus:ring focus:ring-violet-300'
              onClick={handleLikes}
            >
              like
            </button>
          </div>
        </div>
        <div className='text-lg text-gray-800 mb-1 md:mb-2 break-all'>
          <a href={blog.url} target='blank'>{blog.url}</a>
        </div>
        <div className='mb-1 md:mb-2'>
          <span className='text-lg text-white font-medium'>Added by {blog.user.name}</span>
        </div>
        {username === blog.user.username && (
          <div className='place-self-center mb-1 md:mb-2'>
            <button
              className='bg-violet-700 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded active:bg-violet-900 focus:outline-none focus:ring focus:ring-violet-300'
              onClick={handleDelete}
            >
              remove
            </button>
          </div>
        )}
      </div>
      <div className='flex flex-col'>
        <h3 className='text-lg text-white font-medium mb-1 md:mb-2'>Comments:</h3>
        <form className='flex flex-col mb-1 md:mb-2' onSubmit={handleSubmit}>
          <textarea
            className='bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 md:h-24 lg:h-28 py-2 px-3 mb-2 md:mb-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white'
            value={newComment}
            name='comment'
            onChange={handleChange}
            placeholder='Type your comment'
          />
          <button
            className='place-self-center bg-violet-700 hover:bg-violet-800 text-white font-bold py-1 px-2 rounded active:bg-violet-900 focus:outline-none focus:ring focus:ring-violet-300'
            type='submit'
          >
            add comment
          </button>
        </form>
        <ul>
          {blog.comments.map((comment, index) =>
            <li
              key={index}
              className='text-medium text-gray-300 font-medium border-t p-1 md:p-2'
            >
              <span className='break-words'>{comment}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Blog
