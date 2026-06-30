import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useParams } from 'react-router-dom';
import pages, { labelPages, navItems, type Page } from './data/pages';

const pagesByPath = Object.fromEntries(pages.map((page) => [page.path, page])) as Record<string, Page>;

interface PageViewProps {
  page?: Page;
}

function PageView({ page }: PageViewProps): JSX.Element {
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

function StaticPageView(): JSX.Element {
  const { month, slug } = useParams<{ month?: string; slug?: string }>();
  const [content, setContent] = useState<string | null>(null);
  const [title, setTitle] = useState('Valabhi Astrology');

  useEffect(() => {
    if (!month || !slug) {
      setContent('<div class="load-error"><p>Article path is invalid.</p></div>');
      return;
    }

    const pagePath = `/2026/${month}/${slug}.html`;
    fetch(pagePath)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load article');
        }
        return res.text();
      })
      .then((html) => {
        const titleMatch = html.match(/<h3[^>]*class=["']post-title[^"']*["'][^>]*>([\s\S]*?)<\/h3>/i) || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        if (titleMatch) {
          setTitle(titleMatch[1].replace(/<[^>]+>/g, '').trim());
        }
        setContent(html);
      })
      .catch(() => {
        setContent('<div class="load-error"><p>Unable to load the requested article.</p></div>');
      });
  }, [month, slug]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (!content) {
      return;
    }

    const container = document.getElementById('static-page-content');
    if (!container) {
      return;
    }

    const showLang = (lang: string, btn: HTMLElement) => {
      container.querySelectorAll<HTMLElement>('.lang-content').forEach((el) => el.classList.remove('active'));
      container.querySelectorAll<HTMLElement>('.lang-tab').forEach((el) => el.classList.remove('active'));
      const target = container.querySelector<HTMLElement>('#lang-' + lang);
      if (target) {
        target.classList.add('active');
      }
      btn.classList.add('active');
    };

    container.querySelectorAll<HTMLButtonElement>('.lang-tab').forEach((button) => {
      const onclick = button.getAttribute('onclick');
      const langMatch = onclick?.match(/showLang\(['\"]([^'\"]+)['\"]/)?.[1];
      if (langMatch) {
        button.dataset.lang = langMatch;
      }
      button.removeAttribute('onclick');
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const lang = button.dataset.lang || button.textContent?.trim().toLowerCase() || 'en';
        showLang(lang, button);
      });
    });

    return () => {
      container.querySelectorAll<HTMLButtonElement>('.lang-tab').forEach((button) => {
        button.onclick = null;
      });
    };
  }, [content]);

  return (
    <main className="page-main">
      {content ? (
        <div id="static-page-content" className="page-content" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <div className="loading-state">Loading article…</div>
      )}
    </main>
  );
}

function App(): JSX.Element {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-name">Valabhi Astrology</span>
          <span className="brand-subtitle">Vedic Jyotish & Vastu Guidance</span>
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
        <Route path="/search/label/:label" element={<LabelView />} />
        <Route path="/search/label/:label.html" element={<LabelView />} />
        <Route path="/2026/:month/:slug.html" element={<StaticPageView />} />
        <Route path="/2026/:month/:slug" element={<StaticPageView />} />
        <Route path="*" element={<PageView page={pagesByPath['/']} />} />
      </Routes>
      <footer className="site-footer">
        <p>Valabhi Astrology — Toronto-based Vedic astrology, vastu and karmic guidance.</p>
      </footer>
    </div>
  );
}

export default App;
