import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'

import './index.css'
import { NotificationContextProvider } from './context/NotificationContext'
import { LoginContextProvider } from './context/LoginContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationContextProvider>
    <LoginContextProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <App />
        </Router>
      </QueryClientProvider>
    </LoginContextProvider>
  </NotificationContextProvider>
)
