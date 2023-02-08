const Notification = ({ message }) => {
  if (message.success === true) {
    return <div className='successful msg'>{message.msg}</div>
  } else if (message.success === false) {
    return <div className='failed msg'>{message.msg}</div>
  } else {
    return null
  }
}

export default Notification
