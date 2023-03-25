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

  const user = request.user

  const blog = await new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  let savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  savedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })

  response.status(201).json(savedBlog)
})

blogsRouter.post('/:id/comments', userExtractor, async (request, response) => {
  const { comment } = request.body
  const { id } = request.params

  const blog = await Blog
    .findById(id)

  blog.comments = blog.comments.concat(comment)

  let savedBlog = await blog.save()

  savedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blogId = request.params.id
  const user = request.user

  const blog = await Blog.findById(blogId)

  if (!blog) {
    return response.status(204).end()
  }

  if (!user || blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({
      error: 'only the creator can delete a blog'
    })
  }

  user.blogs = user.blogs.filter(b => b.toString() !== blog.id.toString())

  await user.save()
  await Blog.findByIdAndRemove(blogId)

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const blogId = request.params.id

  let updatedBlog = await Blog.findByIdAndUpdate(blogId, { title, url, author, likes }, { new: true })

  updatedBlog = await Blog.findById(updatedBlog._id).populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})

module.exports = blogsRouter
