const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    for (const blog of helper.initialBlogs) {
      const blogObject = new Blog(blog)
      await blogObject.save()
    }
  }, 10000)

  describe('HTTP GET request:', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')

      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
      const response = await api.get('/api/blogs')

      expect(response.body).toContainEqual({
        id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
      })
    })

    test('the unique identifier property of the blogs are returned as id', async () => {
      const response = await api.get('/api/blogs')

      const ids = response.body.map(blog => blog.id)

      for (const id of ids) {
        expect(id).toBeDefined()
      }
    })
  })

  describe('HTTP GET by id request:', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

      expect(resultBlog.body).toEqual(processedBlogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('HTTP POST request:', () => {
    let token = null

    beforeEach(async () => {
      await User.deleteMany({})
      const passwordHash = await bcrypt.hash('1234', 10)

      const user = new User({
        username: 'test',
        passwordHash,
        name: 'test name'
      })

      const savedUser = await user.save()

      const userForToken = {
        username: savedUser.username,
        id: user._id
      }

      token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60 * 60 }
      )
    })

    afterEach(() => {
      token = null
    })

    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'Books people (re)read',
        author: 'Guillermo Rauch',
        url: 'https://rauchg.com/2020/books-people-reread',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const blogs = blogsAtEnd.map(blog => ({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
      }))
      expect(blogs).toContainEqual(newBlog)
    })

    test('a blog without likes property will default to the value 0', async () => {
      const newBlog = {
        title: 'Books people (re)read',
        author: 'Guillermo Rauch',
        url: 'https://rauchg.com/2020/books-people-reread'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const blogs = blogsAtEnd.map(blog => ({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
      }))
      expect(blogs).toContainEqual({
        title: 'Books people (re)read',
        author: 'Guillermo Rauch',
        url: 'https://rauchg.com/2020/books-people-reread',
        likes: 0
      })
    })

    test('a blog without title or url properties is returned as code 400 Bad Request', async () => {
      let newBlog = {
        author: 'Guillermo Rauch',
        url: 'https://rauchg.com/2020/books-people-reread',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      newBlog = {
        title: 'Books people (re)read',
        author: 'Guillermo Rauch',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('fail a blog with unauthorized token can not be added', async () => {
      token = null
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: 'Books people (re)read',
        author: 'Guillermo Rauch',
        url: 'https://rauchg.com/2020/books-people-reread',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      expect(blogsAtEnd).toEqual(blogsAtStart)
    })
  })

  describe('HTTP DELETE request:', () => {
    let token = null

    beforeEach(async () => {
      await User.deleteMany({})
      await Blog.deleteMany({})

      const passwordHash = await bcrypt.hash('1234', 10)

      const user = new User({
        username: 'test',
        passwordHash,
        name: 'test name'
      })

      const savedUser = await user.save()

      const userForToken = {
        username: savedUser.username,
        id: user._id
      }

      token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60 * 60 }
      )

      const newBlog = {
        title: 'Books people (re)read',
        author: 'Guillermo Rauch',
        url: 'https://rauchg.com/2020/books-people-reread',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    })

    afterEach(() => {
      token = null
    })

    test('a blog is deleted success with statuscode 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
      expect(blogsAtEnd).not.toContainEqual(blogToDelete)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
      const invalidId = '5da59070081a8'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })

    test('fail with status 401 if user is not authorized', async () => {
      token = null
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
      expect(blogsAtEnd).toEqual(blogsAtStart)
    })
  })

  describe('HTTP PUT request:', () => {
    let token = null

    beforeEach(async () => {
      await User.deleteMany({})
      await Blog.deleteMany({})

      const passwordHash = await bcrypt.hash('1234', 10)

      const user = new User({
        username: 'test',
        passwordHash,
        name: 'test name'
      })

      const savedUser = await user.save()

      const userForToken = {
        username: savedUser.username,
        id: user._id
      }

      token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60 * 60 }
      )

      let newBlog = {
        title: 'Books people (re)read',
        author: 'Guillermo Rauch',
        url: 'https://rauchg.com/2020/books-people-reread',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      newBlog = {
        title: 'Blog to upload',
        author: 'test',
        url: 'www.test.com',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    })

    afterEach(() => {
      token = null
    })
    test('a blog is updated success with statuscode 200 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[1]

      const modifications = {
        likes: 100
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(modifications)
        .expect(200)

      const blogUpdated = blogToUpdate
      blogUpdated.likes = modifications.likes

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

      expect(blogsAtEnd).toContainEqual(blogUpdated)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5da59070081a8'

      await api
        .put(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })

    test('fail with status 401 if user is not authorized', async () => {
      token = null
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const modifications = {
        likes: 100
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(modifications)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

      expect(blogsAtEnd).toEqual(blogsAtStart)
    })
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('1234', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'roma',
      name: 'roma dev ',
      password: '1234'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      password: '1234',
      name: 'Superuser'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username and password are required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'romadev',
      name: 'romadev'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username and password are required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if username is 3 character or less', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'rom',
      name: 'romadev',
      password: '1234'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username and password must be at least 3 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if password is 3 character or less', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'romadev',
      name: 'romadev',
      password: '123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username and password must be at least 3 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: '1234'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
