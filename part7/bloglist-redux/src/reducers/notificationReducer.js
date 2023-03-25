import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  msg: null,
  success: null
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    set (state, action) {
      return action.payload
    },
    clear (state, action) {
      return initialState
    }
  }
})

export const setNotification = (content, seconds) => {
  return async dispacth => {
    dispacth(set(content))
    setTimeout(() => {
      dispacth(clear())
    }, seconds * 1000)
  }
}

export const { set, clear } = notificationSlice.actions
export default notificationSlice.reducer
