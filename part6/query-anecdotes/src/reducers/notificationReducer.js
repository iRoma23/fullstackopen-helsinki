const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'createNotification':
      return action.payload
    case 'clearNotification':
      return null
    default:
      return null
  }
}

export const setNotification = message => {
  return ({
    type: 'createNotification',
    payload: message
  })
}

export default notificationReducer