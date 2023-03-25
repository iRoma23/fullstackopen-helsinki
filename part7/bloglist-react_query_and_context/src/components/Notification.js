import { useNotificationValue } from '../context/NotificationContext'

import IconCheck from '../svg/IconCheck'
import IconXCircle from '../svg/IconXCircle'

const Toast = ({ children, message, color }) => {
  return (
    <div className={`flex justify-center items-center w-full max-w-xs md:max-w-sm border-solid border-4 ${color === 'green' ? 'border-green-500' : 'border-red-500'} rounded-lg p-4 bg-gray-300`}>
      <div className={`${color === 'green' ? 'text-green-500' : 'text-red-500'}`}>
        {children}
      </div>
      <div className='px-4'>
        <span className={`text-lg font-medium ${color === 'green' ? 'text-green-500' : 'text-red-500'}`}>{message}</span>
      </div>
    </div>
  )
}

const Notification = () => {
  const notification = useNotificationValue()

  if (notification.success === true) {
    return (
      <div className='flex justify-center'>
        <Toast message={notification.msg} color='green'>
          <IconCheck />
        </Toast>
      </div>
    )
  } else if (notification.success === false) {
    return (
      <div className='flex justify-center'>
        <Toast message={notification.msg} color='red'>
          <IconXCircle />
        </Toast>
      </div>
    )
  } else {
    return null
  }
}

export default Notification
