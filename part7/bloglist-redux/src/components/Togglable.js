import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef(({ children, buttonLabel }, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = visible ? 'hidden' : ''
  const showWhenVisible = visible ? '' : 'hidden'

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div className='my-2 md:my-4'>
      <div className={`${hideWhenVisible} `}>
        <button className='bg-violet-700 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded active:bg-violet-900 focus:outline-none focus:ring focus:ring-violet-300' onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div className={`${showWhenVisible} flex flex-col`}>
        {children}
        <div className='flex justify-center mb-2 md:mb-4'>
          <button className='bg-violet-700 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded active:bg-violet-900 focus:outline-none focus:ring focus:ring-violet-300' onClick={toggleVisibility}>cancel</button>
        </div>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export default Togglable
