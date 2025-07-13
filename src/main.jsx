import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './index.css'
import { RouterProvider } from 'react-router'
import router from './routes/Routes.jsx'
import AuthProvider from './contexts/AuthProvider.jsx'
import AnimatedPage from './components/AnimatedPage.jsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <AnimatedPage>
      <RouterProvider router={router}></RouterProvider>
    </AnimatedPage>
  </AuthProvider>
  </QueryClientProvider>
  </StrictMode>,
)
