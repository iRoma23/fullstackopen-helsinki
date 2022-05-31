import React from 'react'

const Notification = ({ message }) => {
  if (message.success === null) {
    return null
  } else if (message.success === true) {
    return <div className='successful msg'>{message.msg}</div>
  } else {
    return <div className='failed msg'>{message.msg}</div>
  }
}

export default Notification