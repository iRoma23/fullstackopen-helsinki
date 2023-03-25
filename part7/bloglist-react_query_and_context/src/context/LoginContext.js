import { createContext, useReducer, useContext } from 'react'
import loginService from '../services/login'

const initialState = null

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload
    case 'LOGOUT':
      return initialState
    default:
      return initialState
  }
}

const LoginContext = createContext()

export const LoginContextProvider = props => {
  const [user, dispatch] = useReducer(reducer, initialState)

  return (
    <LoginContext.Provider value={[user, dispatch]}>
      {props.children}
    </LoginContext.Provider>
  )
}

export const useLoginValue = () => {
  const valueAndDispatch = useContext(LoginContext)
  return valueAndDispatch[0]
}

export const useLoginDispatch = () => {
  const valueAndDispatch = useContext(LoginContext)
  return valueAndDispatch[1]
}

export const useLogin = () => {
  const dispatch = useLoginDispatch()
  return async (username, password) => {
    const user = await loginService.login({ username, password })
    dispatch({
      type: 'LOGIN',
      payload: user
    })
    return user
  }
}

export default LoginContext
