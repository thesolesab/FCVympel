import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material'

import './firebase1'

import App from './components/app/App';
import store from './store';

import './styles/index.scss';
import theme from 'theme';

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    // <React.StrictMode>

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <BrowserRouter>
          <Box sx={{ fontFamily: 'AlumniSans' }}>
            <App />
          </Box>
        </BrowserRouter>
      </Provider>
    </ThemeProvider >
    // </React.StrictMode>


  )