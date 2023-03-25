import { createContext, useContext, useReducer } from 'react'

const initialState = {
  msg: null,
  success: null
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return initialState
    default:
      return initialState
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = props => {
  const [notification, dispatch] = useReducer(reducer, initialState)

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const valueAndDispatch = useContext(NotificationContext)
  return valueAndDispatch[0]
}

export const useNotify = () => {
  const valueAndDispatch = useContext(NotificationContext)
  const dispatch = valueAndDispatch[1]
  return (payload) => {
    dispatch({
      type: 'SET',
      payload
    })
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
  }
}

export default NotificationContext
