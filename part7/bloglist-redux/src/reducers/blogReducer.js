import { createSlice } from '@reduxjs/toolkit'
import blogServices from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs (state, action) {
      return action.payload
    },
    appendBlog (state, action) {
      return state.concat(action.payload)
    },
    removeBlog (state, action) {
      const { id } = action.payload
      return state.filter(blog => blog.id !== id)
    },
    replaceBlog (state, action) {
      const replacedBlog = action.payload
      return state.map(blog => blog.id === replacedBlog.id ? replacedBlog : blog)
    }
  }
})

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogServices.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (content) => {
  return async dispatch => {
    try {
      const blog = await blogServices.create(content)
      dispatch(appendBlog(blog))
      dispatch(setNotification({ msg: `a new blog ${blog.title} by ${blog.author} is added`, success: true }, 5))
    } catch (exception) {
      dispatch(setNotification({ msg: exception.response.data.error, success: false }, 5))
    }
  }
}

export const deleteBlog = (content) => {
  return async dispatch => {
    try {
      await blogServices.remove(content.id)
      dispatch(removeBlog(content))
      dispatch(setNotification({ msg: `${content.title} blog is removed`, success: true }, 5))
    } catch (exception) {
      dispatch(setNotification({ msg: exception.response.data.error, success: false }, 5))
    }
  }
}

export const updateBlog = (content) => {
  return async dispatch => {
    try {
      const updatedBlog = await blogServices.update(content)
      dispatch(replaceBlog(updatedBlog))
    } catch (exception) {
      dispatch(setNotification({ msg: exception.response.data.error, success: false }, 5))
    }
  }
}

export const addComment = (id, comment) => {
  return async dispatch => {
    try {
      const addedComment = await blogServices.createComment(id, { comment })
      dispatch(replaceBlog(addedComment))
      dispatch(setNotification({ msg: 'a new comment is added', success: true }, 5))
    } catch (exception) {
      dispatch(setNotification({ msg: exception.response.data.error, success: false }, 5))
    }
  }
}

export const { setBlogs, appendBlog, removeBlog, replaceBlog } = blogSlice.actions
export default blogSlice.reducer
