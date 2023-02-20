import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    createNotification (state, action) {
      return action.payload
    },
    clearNotification (state, action) {
      return null
    }
  }
})

let timeOutId = null

export const setNotification = (message, time) => {
  return async dispatch => {
    clearTimeout(timeOutId)
    dispatch(createNotification(message))

    timeOutId = setTimeout(() => {
      dispatch(clearNotification())
    }, time * 1000)
  }
}

export const { createNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
