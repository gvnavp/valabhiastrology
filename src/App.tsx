import React from 'react';
import { Routes, Route, NavLink, useParams, useNavigate } from 'react-router-dom';
import pages, { labelPages, navItems, type Page } from './data/pages';
import HoroscopePage from './components/horoscope/HoroscopePage';

const pagesByPath = Object.fromEntries(pages.map((page) => [page.path, page])) as Record<string, Page>;

interface PageViewProps {
  page?: Page;
}

function PageView({ page }: PageViewProps): JSX.Element {
  const navigate = useNavigate();

  if (!page) {
    return (
      <main className="page-main">
        <div className="not-found">
          <h1>Page not found</h1>
          <p>The page you requested is not available.</p>
        </div>
      </main>
    );
  }

  document.title = page.title;

  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement).closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    let url: URL;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin) return;

    const internalPath = url.pathname;
    const isInternalPage = Boolean(pagesByPath[internalPath]) || internalPath.startsWith('/search/label/');
    if (!isInternalPage) return;

    event.preventDefault();
    navigate(url.pathname + url.search + url.hash);
  };

  return (
    <main className="page-main">
      <div className="page-content" onClick={handleContentClick} dangerouslySetInnerHTML={{ __html: page.html }} />
    </main>
  );
}

function LabelView(): JSX.Element {
  const { label } = useParams<{ label?: string }>();
  const normalized = label ? label.charAt(0).toUpperCase() + label.slice(1) : '';
  const labelPage = normalized ? labelPages[normalized] : undefined;

  if (!labelPage) {
    return (
      <main className="page-main">
        <div className="not-found">
          <h1>Category not found</h1>
          <p>We could not find the requested label page.</p>
        </div>
      </main>
    );
  }

  document.title = labelPage.title;
  return (
    <main className="page-main">
      <div className="page-content" dangerouslySetInnerHTML={{ __html: labelPage.html }} />
    </main>
  );
}

function App(): JSX.Element {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-name">Valabhi Astrology</span>
          <span className="brand-subtitle">Peak of Celestial Wisdom</span>
        </div>
        <nav className="site-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }: { isActive: boolean }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Routes>
        {pages.map((page) => (
          <Route key={page.path} path={page.path} element={<PageView page={page} />} />
        ))}
        <Route path="/horoscope" element={<HoroscopePage />} />
        <Route path="/search/label/:label" element={<LabelView />} />
        <Route path="/search/label/:label.html" element={<LabelView />} />
        <Route path="*" element={<PageView page={pagesByPath['/']} />} />
      </Routes>
      <footer className="site-footer">
        <p>Valabhi Astrology — Toronto-based Vedic astrology, vastu and karmic guidance.</p>
      </footer>
    </div>
  );
}

export default App;
