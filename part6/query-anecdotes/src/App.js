import { useMutation, useQuery, useQueryClient } from 'react-query'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './requests'

import { setNotification } from './reducers/notificationReducer'
import { useNotificationDispatch} from './NotificationContext'

let timeOutId = null

const App = () => {
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: newAnecdote => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData(
        'anecdotes',
        anecdotes.map(anecdote => anecdote.id !== newAnecdote.id ? anecdote : newAnecdote))
    }
  })
  
  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})

    clearTimeout(timeOutId)
    dispatch(setNotification(`you voted '${anecdote.content}'`))
    timeOutId = setTimeout(() => {
      dispatch({ type: 'clearNotification' })
    }, 5000)
  }
  
  const result = useQuery(
    'anecdotes',
    getAnecdotes
  )

  console.log(result)

  if (result.isLoading) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
