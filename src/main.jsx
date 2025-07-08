import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './routes/Routes.jsx'
import AuthProvider from './contexts/AuthProvider.jsx'
import AnimatedPage from './components/AnimatedPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AuthProvider>
    <AnimatedPage>
      <RouterProvider router={router}></RouterProvider>
    </AnimatedPage>
  </AuthProvider>
  </StrictMode>,
)
