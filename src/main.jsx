import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppBootstrap from './components/AppBootstrap.jsx'
import { consumeAuthCallback, authRecovery } from './game/authRecovery.js'

const recoveryFlow = (() => {
  const callback = consumeAuthCallback(window.location, window.history)
  if (!callback) return null
  const flow = authRecovery.createFlow(callback)
  callback.accessToken = ''
  callback.tokenHash = ''
  return flow
})()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppBootstrap recoveryFlow={recoveryFlow} />
  </StrictMode>,
)
