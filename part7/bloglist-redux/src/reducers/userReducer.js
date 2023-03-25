import { createSlice } from '@reduxjs/toolkit'
import userServices from '../services/users'

const initialState = []

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers (state, action) {
      return action.payload
    }
  }
})

export const initializeUsers = () => {
  return async dispatch => {
    const users = await userServices.getAll()
    dispatch(setUsers(users))
  }
}

export const { setUsers } = userSlice.actions
export default userSlice.reducer
