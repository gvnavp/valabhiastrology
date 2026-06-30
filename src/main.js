import React from 'https://esm.sh/react@18.3.1';
import ReactDOM from 'https://esm.sh/react-dom@18.3.1/client';
import { HashRouter } from 'https://esm.sh/react-router-dom@6.18.2';
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
