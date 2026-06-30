import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.js';

const rootElement = document.getElementById('root');

if (rootElement) {
  document.title = 'Valabhi Astrology';

  try {
    ReactDOM.createRoot(rootElement).render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(
          HashRouter,
          null,
          React.createElement(App)
        )
      )
    );
  } catch (error) {
    console.error('Failed to render Valabhi Astrology app', error);
  }
}
