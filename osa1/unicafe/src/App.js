import { useState } from 'react'

const Button = ({text, handleClick}) => {
  return (
    <>
      <button onClick={handleClick}>{text}</button>
    </>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <>
      <p>{text} {value}</p>
    </>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const positive = (good / all * 100) + " %"
  if (all === 0) {
    return (
      <>
        <p>No feedback given</p>
      </>
    )
  } else {
    return (
      <>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={(good - bad) / all} />
        <StatisticLine text="positive" value={positive}/>
      </>
    )
  }
}

const App = () =>  {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClickGood = () => setGood(good + 1)
  const handleClickNeutral = () => setNeutral(neutral + 1)
  const handleClickBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" handleClick={handleClickGood} />
      <Button text="neutral" handleClick={handleClickNeutral} />
      <Button text="bad" handleClick={handleClickBad} />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} / >
    </div>
  )
}

export default App;
