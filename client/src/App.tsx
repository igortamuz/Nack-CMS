import React from 'react';

import Routes from './routes';
import AppProvider from './hooks/provider';
import {BrowserRouter as Router} from 'react-router-dom'

import "tailwindcss/dist/base.css";
import "./styles/index.css";

const App: React.FC = () => {
  return(
    <Router>
      <AppProvider>
        <Routes />
      </AppProvider>
    </Router>
  )
}

export default App;
