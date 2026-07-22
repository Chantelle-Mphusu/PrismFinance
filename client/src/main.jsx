import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {AuthProvider} from './context/AuthContext.jsx'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
    </AuthProvider> 
  </StrictMode>,
)
