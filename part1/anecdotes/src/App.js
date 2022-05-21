import { useState } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const Anecdote = ({ title, anecdote, votes}) => {
  return (
    <div>
      <h2>{title}</h2>
      {anecdote}
      <p>has {votes} votes</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
  
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const handleRandomClick = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const handleVoteClick = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  const maxIndexVote = () => {
    let maxVote = 0
    let maxIndex = 0

    for (let i = 0; i < votes.length; i++) {
      if (votes[i] > maxVote) {
        maxVote = votes[i]
        maxIndex = i
      }
    }
    return maxIndex
  }
  
  const anecdote = anecdotes[selected]
  const anecdoteVotes = votes[selected]
  const maxAnecdote = anecdotes[maxIndexVote()]
  const maxAnecdoteVotes = votes[maxIndexVote()]

  return (
    <>
      <Anecdote 
        title="Anecdote with most votes" 
        anecdote={anecdote} 
        votes={anecdoteVotes}
      />
      <Button handleClick={handleVoteClick} text="vote" />
      <Button handleClick={handleRandomClick} text="next anecdote" />
      <Anecdote 
        title="Anecdote with most votes" 
        anecdote={maxAnecdote} 
        votes={maxAnecdoteVotes}
      />
    </>
  )
}

export default App
