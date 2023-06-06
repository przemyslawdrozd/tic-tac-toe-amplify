import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@aws-amplify/ui-react/styles.css'
import { Amplify } from 'aws-amplify'
import awsExports from './aws-exports'
import { StateContext } from './context/context.tsx'

Amplify.configure(awsExports)
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StateContext>
      <App />
    </StateContext>
  </React.StrictMode>,
)
