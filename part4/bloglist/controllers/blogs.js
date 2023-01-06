const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = await request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blogId = request.params.id
  const user = await request.user

  const blog = await Blog.findById(blogId)

  if (!blog) {
    return response.status(204).end()
  }

  if (!(blog.user.toString() === user._id.toString())) {
    return response.status(401).json({
      error: 'no permission'
    })
  }

  await Blog.findByIdAndRemove(blogId)

  response.status(204).end()
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const body = request.body
  const blogId = request.params.id
  const user = await request.user

  const blog = await Blog.findById(blogId)

  if (!(blog.user.toString() === user._id.toString())) {
    return response.status(401).json({
      error: 'no permission'
    })
  }

  const blogToUpdate = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(blogId, blogToUpdate, { new: true })

  response.json(updatedBlog)
})

module.exports = blogsRouter
