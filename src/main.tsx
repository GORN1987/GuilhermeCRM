import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { GoogleOAuthProvider } from "@react-oauth/google"

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId='260219835326-m7pgajevjiaedl1pac82sqnc4l1rafsm.apps.googleusercontent.com'>
  <StrictMode>
  
    <App />
  </StrictMode>
  </GoogleOAuthProvider>
)
