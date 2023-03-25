import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'

const BlogForm = ({ togglableRef }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const dispatch = useDispatch()

  const handleSubmit = event => {
    event.preventDefault()

    togglableRef.current.toggleVisibility()
    dispatch(createBlog(newBlog))
    setNewBlog({
      title: '',
      author: '',
      url: ''
    })
  }

  const handleChange = event => {
    const { value, name } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  return (
    <div className='flex flex-col items-center mt-4'>
      <h2 className='text-3xl font-normal md:font-semibold text-white my-2'>create new</h2>
      <form onSubmit={handleSubmit}>
        <div className='flex my-1 md:my-2'>
          <span className='text-base font-medium text-white p-2 w-20 md:w-24'>
            title:
          </span>
          <input
            className='w-36 md:w-44 lg:w-52 h-7 md:h-8 font-medium md:font-semibold self-center'
            type='text'
            value={newBlog.title}
            name='title'
            onChange={handleChange}
          />
        </div>
        <div className='flex my-1 md:my-2'>
          <span className='text-base font-medium text-white p-2 w-20 md:w-24'>
            author:
          </span>
          <input
            className='w-36 md:w-44 lg:w-52 h-7 md:h-8 font-medium md:font-semibold self-center'
            type='text'
            value={newBlog.author}
            name='author'
            onChange={handleChange}
          />
        </div>
        <div className='flex my-1 md:my-2'>
          <span className='text-base font-medium text-white p-2 w-20 md:w-24'>
            url:
          </span>
          <input
            className='w-36 md:w-44 lg:w-52 h-7 md:h-8 font-medium md:font-semibold self-center'
            type='text'
            value={newBlog.url}
            name='url'
            onChange={handleChange}
          />
        </div>
        <div className='flex justify-center my-2 md:my-4'>
          <button className='bg-violet-700 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded active:bg-violet-900 focus:outline-none focus:ring focus:ring-violet-300' type='submit'>create</button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm
