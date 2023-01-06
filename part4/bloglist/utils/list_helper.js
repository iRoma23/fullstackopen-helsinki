const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sumLikes, post) => {
    return sumLikes + post.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  const reducer = (mostLikedPost, currentPost) => {
    return mostLikedPost.likes > currentPost.likes ? mostLikedPost : currentPost
  }

  const blogMostLikes = blogs.reduce(reducer)

  return {
    title: blogMostLikes.title,
    author: blogMostLikes.author,
    likes: blogMostLikes.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const countedAuthors = blogs.reduce((allAuthors, blog) => {
    const currCount = allAuthors[blog.author] ?? 0
    return {
      ...allAuthors,
      [blog.author]: currCount + 1
    }
  }, {})

  const topCountedAuthor = Object.keys(countedAuthors).reduce((prev, curr) => {
    return countedAuthors[prev] > countedAuthors[curr] ? prev : curr
  })

  return {
    author: topCountedAuthor,
    blogs: countedAuthors[topCountedAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const countedLikes = blogs.reduce((allAuthors, blog) => {
    const currLikes = allAuthors[blog.author] ?? 0
    return {
      ...allAuthors,
      [blog.author]: currLikes + blog.likes
    }
  }, {})

  const topLikesAuthor = Object.keys(countedLikes).reduce((prev, curr) => {
    return countedLikes[prev] > countedLikes[curr] ? prev : curr
  })
  return {
    author: topLikesAuthor,
    likes: countedLikes[topLikesAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
