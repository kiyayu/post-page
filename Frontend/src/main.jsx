import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
 import { ToastContainer } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
 import { ThemeProvider } from './context/ThemeContext';
import './index.css'
import App from './App'
 
  
 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider> 
   <App/>
   <ToastContainer /> 
   </ThemeProvider>
  </StrictMode>,
)
