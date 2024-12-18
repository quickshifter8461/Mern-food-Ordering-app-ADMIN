import React from 'react'
import {Box, Button, CssBaseline, ThemeProvider, Typography} from '@mui/material'
import { darkTheme } from './components/Theme/DarkTheme'
import { AuthProvider } from './components/Auth/AuthContext'
import { AppProvider } from './components/AppContext/AppContext'
import AdminRoutes from './Routes/AdminRoutes'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <AuthProvider>
        <AppProvider>
          <AdminRoutes/>
        </AppProvider>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  )
}

export default App