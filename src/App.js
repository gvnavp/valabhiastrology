import React from 'https://esm.sh/react@18.3.1';
import { Routes, Route, NavLink, useParams } from 'https://esm.sh/react-router-dom@6.18.2';
import pages, { navItems, labelPages } from './data/pages.js';

const pagesByPath = Object.fromEntries(pages.map((page) => [page.path, page]));

function PageView({ page }) {
  if (!page) {
    return React.createElement(
      'main',
      { className: 'page-main' },
      React.createElement(
        'div',
        { className: 'not-found' },
        React.createElement('h1', null, 'Page not found'),
        React.createElement('p', null, 'The page you requested is not available.')
      )
    );
  }

  document.title = page.title;

  return React.createElement(
    'main',
    { className: 'page-main' },
    React.createElement('div', {
      className: 'page-content',
      dangerouslySetInnerHTML: { __html: page.html }
    })
  );
}

function LabelView() {
  const { label } = useParams();
  const normalized = label ? label.charAt(0).toUpperCase() + label.slice(1) : '';
  const labelPage = labelPages[normalized];

  if (!labelPage) {
    return React.createElement(
      'main',
      { className: 'page-main' },
      React.createElement(
        'div',
        { className: 'not-found' },
        React.createElement('h1', null, 'Category not found'),
        React.createElement('p', null, 'We could not find the requested label page.')
      )
    );
  }

  document.title = labelPage.title;
  return React.createElement(
    'main',
    { className: 'page-main' },
    React.createElement('div', {
      className: 'page-content',
      dangerouslySetInnerHTML: { __html: labelPage.html }
    })
  );
}

function App() {
  return React.createElement(
    'div',
    { className: 'app-shell' },
    React.createElement(
      'header',
      { className: 'site-header' },
      React.createElement(
        'div',
        { className: 'brand' },
        React.createElement('span', { className: 'brand-name' }, 'Valabhi Astrology'),
        React.createElement('span', { className: 'brand-subtitle' }, 'Vedic Jyotish & Vastu Guidance')
      ),
      React.createElement(
        'nav',
        { className: 'site-nav' },
        ...navItems.map((item) =>
          React.createElement(
            NavLink,
            {
              key: item.path,
              to: item.path,
              className: ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')
            },
            item.label
          )
        )
      )
    ),
    React.createElement(
      Routes,
      null,
      ...pages.map((page) =>
        React.createElement(Route, {
          key: page.path,
          path: page.path,
          element: React.createElement(PageView, { page })
        })
      ),
      React.createElement(Route, {
        path: '/search/label/:label',
        element: React.createElement(LabelView)
      }),
      React.createElement(Route, {
        path: '/search/label/:label.html',
        element: React.createElement(LabelView)
      }),
      React.createElement(Route, {
        path: '*',
        element: React.createElement(PageView, { page: pagesByPath['/'] })
      })
    ),
    React.createElement(
      'footer',
      { className: 'site-footer' },
      React.createElement('p', null, 'Valabhi Astrology — Toronto-based Vedic astrology, vastu and karmic guidance.')
    )
  );
}

export default App;
