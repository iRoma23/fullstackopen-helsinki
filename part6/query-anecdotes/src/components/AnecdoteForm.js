import { useMutation, useQueryClient } from "react-query"
import { createAnecdote } from "../requests"

import { useNotificationDispatch } from "../NotificationContext"
import { setNotification } from "../reducers/notificationReducer"

let timeOutId = null

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: newAnecdote => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
    },
    onError: (error) => {
      clearTimeout(timeOutId)
      dispatch(setNotification(error.response.data.error))
      timeOutId = setTimeout(() => {
        dispatch({ type: 'clearNotification' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
      event.preventDefault()
      const content = event.target.anecdote.value
      event.target.anecdote.value = ''
      newAnecdoteMutation.mutate({ content, votes: 0 })
      console.log(newAnecdoteMutation)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
