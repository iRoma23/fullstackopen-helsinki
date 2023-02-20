import { createSlice } from '@reduxjs/toolkit'

import anecdoteServices from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addVote (state, action) {
      const votedAnecdote = action.payload
      return state.map(anecdote => anecdote.id !== votedAnecdote.id ? anecdote : votedAnecdote)
    },
    appendAnecdote (state, action) {
      state.push(action.payload)
    },
    setAnecdote (state, action) {
      return action.payload
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdote = await anecdoteServices.getAll()
    dispatch(setAnecdote(anecdote))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteServices.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const voteUpdated = await anecdoteServices.update(anecdote)
    dispatch(addVote(voteUpdated))
  }
}

export const { addVote, appendAnecdote, setAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
