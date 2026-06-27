import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  document.title = 'Valabhi Astrology';

  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render Valabhi Astrology app', error);
  }
}
