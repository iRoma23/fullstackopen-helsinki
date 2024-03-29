import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks/index'

const CreateNew = (props) => {
  const { reset: resetContent, ...content } = useField('content', 'text')
  const { reset: resetAuthor, ...author } = useField('author', 'text')
  const { reset: resetInfo, ...info } = useField('info', 'text')

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/')
  }

  const handleReset = (e) => {
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button>create</button>
        <button type='reset' onClick={handleReset}>reset</button>
      </form>
    </div>
  )

}

export default CreateNew