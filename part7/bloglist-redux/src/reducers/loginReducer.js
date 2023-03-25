import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'

const initialState = null

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser (state, action) {
      return action.payload
    },
    clearUser (state, action) {
      return initialState
    }
  }
})

export const login = (username, password) => {
  return async dispatch => {
    const user = await loginService.login({ username, password })
    dispatch(setUser(user))
    return user
  }
}

export const { setUser, clearUser } = loginSlice.actions
export default loginSlice.reducer
