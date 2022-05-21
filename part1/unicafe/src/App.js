import { useState } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td><td>{value}</td>
    </tr>
  )
  
}

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (all === 0) {
    return(
      <p>No feedback given</p>
    )
  }
  return(
    <table>
      <tbody>
        <StatisticsLine text='good' value={good} />
        <StatisticsLine text='neutral' value={neutral} />
        <StatisticsLine text='bad' value={bad} />
        <StatisticsLine text='all' value={all} />
        <StatisticsLine text='average' value={average} />
        <StatisticsLine text='positive' value={positive + '%'} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClick = (feedback) => () => {
    if (feedback === 'good') {
      setGood(good + 1)
    } else if (feedback === 'neutral') {
      setNeutral(neutral + 1)
    } else if (feedback === 'bad') {
      setBad(bad + 1)
    }
  }

  const all = good + neutral + bad
  const average = (good - bad)/all
  const positive = 100 * good / all

  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={handleClick('good')} text={'good'} />
      <Button handleClick={handleClick('neutral')} text={'neutral'} />
      <Button handleClick={handleClick('bad')} text={'bad'} />
      <h2>statistics</h2>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        positive={positive}
      />
    </div>
  )
}

export default App