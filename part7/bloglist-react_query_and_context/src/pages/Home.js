import { useRef } from 'react'

import Togglable from '../components/Togglable'
import BlogForm from '../components/BlogForm'
import BlogsList from '../components/BlogList'

const Home = () => {
  const blogFormRef = useRef()
  return (
    <div>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm togglableRef={blogFormRef} />
      </Togglable>
      <BlogsList />
    </div>
  )
}

export default Home
