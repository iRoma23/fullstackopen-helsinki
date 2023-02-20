import React from 'react'
import ReactDOM from 'react-dom/client'

import counterReducer from './reducer'
import { createStore } from 'redux'

const store =  createStore(counterReducer)

const App = () => {
  return (
    <div>
      <div>
        <button onClick={() => store.dispatch({type: 'GOOD'})}>good</button>
        <button onClick={() => store.dispatch({type: 'OK'})}>ok</button>
        <button onClick={() => store.dispatch({type: 'BAD'})}>bad</button>
        <button onClick={() => store.dispatch({type: 'ZERO'})}>reset stats</button>
      </div>
      <div>
        <p>good: <span>{store.getState().good}</span></p>
        <p>ok: <span>{store.getState().ok}</span></p>
        <p>bad: <span>{store.getState().bad}</span></p>
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)