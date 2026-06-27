import { Routes, Route, NavLink, useParams } from 'react-router-dom';
import pages, { navItems, labelPages } from './data/pages';

const pagesByPath = Object.fromEntries(pages.map((page) => [page.path, page]));

function PageView({ page }) {
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

  return (
    <main className="page-main">
      <div className="page-content" dangerouslySetInnerHTML={{ __html: page.html }} />
    </main>
  );
}

function LabelView() {
  const { label } = useParams();
  const normalized = label ? label.charAt(0).toUpperCase() + label.slice(1) : '';
  const labelPage = labelPages[normalized];

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

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-name">Valabhi Astrology</span>
          <span className="brand-subtitle">Vedic Jyotish & Vastu Guidance</span>
        </div>
        <nav className="site-nav">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Routes>
        {pages.map((page) => (
          <Route key={page.path} path={page.path} element={<PageView page={page} />} />
        ))}
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
