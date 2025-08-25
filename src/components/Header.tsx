import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  // Initialize theme from saved preference or system
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      const prefers = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const enableDark = saved ? saved === "dark" : prefers;
      setDark(enableDark);
      document.documentElement.classList.toggle("dark", enableDark);
    } catch {
      // ignore
    }
  }, []);

  // If no explicit preference is saved, follow system changes live
  useEffect(() => {
    let mql: MediaQueryList | null = null;
    let handler: ((e: MediaQueryListEvent) => void) | null = null;
    try {
      const saved = localStorage.getItem("theme");
      if (!saved && window.matchMedia) {
        mql = window.matchMedia("(prefers-color-scheme: dark)");
        handler = (e: MediaQueryListEvent) => {
          const next = e.matches;
          setDark(next);
          document.documentElement.classList.toggle("dark", next);
        };
        // add listener with cross-browser support
        if ("addEventListener" in mql) {
          mql.addEventListener("change", handler as EventListener);
        } else if ("addListener" in mql) {
          // @ts-expect-error legacy Safari
          mql.addListener(handler);
        }
      }
    } catch {
      // ignore
    }
    return () => {
      if (mql && handler) {
        if ("removeEventListener" in mql) {
          mql.removeEventListener("change", handler as EventListener);
        } else if ("removeListener" in mql) {
          // @ts-expect-error legacy Safari
          mql.removeListener(handler);
        }
      }
    };
  }, []);

  function toggleTheme() {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
  try { localStorage.setItem("theme", next ? "dark" : "light"); } catch { /* ignore */ }
      return next;
    });
  }

  function close() {
    setOpen(false);
  }

  return (
    <header className="bg-white/90 dark:bg-neutral-dark/80 backdrop-blur border-b border-neutral-light dark:border-neutral sticky top-0 z-40 shadow-soft">
      <div className="max-w-7xl mx-auto page-container p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-3"
            aria-label="BrightPlanner home"
          >
            <img
              src="/bp.png"
              alt="BrightPlanner logo"
              className="h-8 sm:h-10 w-auto block"
            />
            <span className="text-left text-brand-dark dark:text-brand-200 font-bold text-xl">
              BrightPlanner
            </span>
          </a>
        </div>

    <nav className="hidden sm:flex items-center space-x-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md transition ${
                isActive
                  ? "bg-neutral-light text-neutral-darkest dark:bg-neutral dark:text-white"
                  : "text-neutral-dark dark:text-neutral-light hover:bg-neutral-lightest dark:hover:bg-neutral"
              }`
            }
          >
            Hjem
          </NavLink>

          <NavLink
            to="/week-planner"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md transition ${
                isActive
                  ? "bg-neutral-light text-neutral-darkest dark:bg-neutral dark:text-white"
                  : "text-neutral-dark dark:text-neutral-light hover:bg-neutral-lightest dark:hover:bg-neutral"
              }`
            }
          >
            Ugeplan
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md transition ${
                isActive
                  ? "bg-neutral-light text-neutral-darkest dark:bg-neutral dark:text-white"
                  : "text-neutral-dark dark:text-neutral-light hover:bg-neutral-lightest dark:hover:bg-neutral"
              }`
            }
          >
            Om
          </NavLink>
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="px-2 py-2 rounded-md bg-neutral-lightest hover:bg-neutral-light text-neutral-dark dark:bg-neutral hover:brightness-110"
            aria-pressed={dark}
            aria-label={dark ? "Skift til lyst tema" : "Skift til mørkt tema"}
            title={dark ? "Skift til lyst tema" : "Skift til mørkt tema"}
          >
            {dark ? (
              // sun icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M10 3.5a1 1 0 011 1V6a1 1 0 11-2 0V4.5a1 1 0 011-1zm0 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM4.964 5.964a1 1 0 011.414 0l1.06 1.06a1 1 0 01-1.414 1.415l-1.06-1.06a1 1 0 010-1.415zM3.5 10a1 1 0 011-1H6a1 1 0 110 2H4.5a1 1 0 01-1-1zm10.536-4.036a1 1 0 010 1.415l-1.06 1.06a1 1 0 11-1.415-1.414l1.06-1.06a1 1 0 011.415 0zM14 9h1.5a1 1 0 110 2H14a1 1 0 110-2zm-8.036 4.536a1 1 0 011.415 0l1.06 1.06a1 1 0 11-1.415 1.415l-1.06-1.06a1 1 0 010-1.415zM10 14a1 1 0 011 1v1.5a1 1 0 11-2 0V15a1 1 0 011-1zm5.036-.464a1 1 0 011.415 0 1 1 0 01-.001 1.415l-1.06 1.06a1 1 0 11-1.415-1.415l1.06-1.06z"/>
              </svg>
            ) : (
              // moon icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
              </svg>
            )}
          </button>
        </div>

        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-neutral-lightest inline-flex items-center justify-center"
            aria-pressed={dark}
            aria-label={dark ? "Skift til lyst tema" : "Skift til mørkt tema"}
            title={dark ? "Lyst tema" : "Mørkt tema"}
          >
            {dark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M10 3.5a1 1 0 011 1V6a1 1 0 11-2 0V4.5a1 1 0 011-1zm0 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM4.964 5.964a1 1 0 011.414 0l1.06 1.06a1 1 0 01-1.414 1.415l-1.06-1.06a1 1 0 010-1.415zM3.5 10a1 1 0 011-1H6a1 1 0 110 2H4.5a1 1 0 01-1-1zm10.536-4.036a1 1 0 010 1.415l-1.06 1.06a1 1 0 11-1.415-1.414l1.06-1.06a1 1 0 011.415 0zM14 9h1.5a1 1 0 110 2H14a1 1 0 110-2zm-8.036 4.536a1 1 0 011.415 0l1.06 1.06a1 1 0 11-1.415 1.415l-1.06-1.06a1 1 0 010-1.415zM10 14a1 1 0 011 1v1.5a1 1 0 11-2 0V15a1 1 0 011-1zm5.036-.464a1 1 0 011.415 0 1 1 0 01-.001 1.415l-1.06 1.06a1 1 0 11-1.415-1.415l1.06-1.06z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
              </svg>
            )}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Luk menu" : "Åbn menu"}
            className="p-2 rounded-md bg-neutral-lightest inline-flex items-center justify-center"
          >
            {open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M3 5h14a1 1 0 100-2H3a1 1 0 100 2zm14 6H3a1 1 0 100 2h14a1 1 0 100-2zm0 6H3a1 1 0 100 2h14a1 1 0 100-2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu (always in DOM so we can animate open/close) */}
      <div
        className={`sm:hidden border-t border-neutral-100 overflow-hidden transition-all duration-200 transform origin-top ${
          open
            ? "max-h-48 opacity-100 scale-y-100"
            : "max-h-0 opacity-0 scale-y-95"
        }`}
        aria-hidden={!open}
      >
        <div className="page-container max-w-7xl mx-auto p-3 flex flex-col gap-2">
          <NavLink
            to="/"
            onClick={close}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md transition ${
                isActive
                  ? "bg-neutral-light text-neutral-darkest"
                  : "text-neutral-dark hover:bg-neutral-lightest"
              }`
            }
          >
            Hjem
          </NavLink>
          <NavLink
            to="/week-planner"
            onClick={close}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md transition ${
                isActive
                  ? "bg-neutral-light text-neutral-darkest"
                  : "text-neutral-dark hover:bg-neutral-lightest"
              }`
            }
          >
            Ugeplan
          </NavLink>
          <NavLink
            to="/about"
            onClick={close}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md transition ${
                isActive
                  ? "bg-neutral-light text-neutral-darkest"
                  : "text-neutral-dark hover:bg-neutral-lightest"
              }`
            }
          >
            Om
          </NavLink>
        </div>
      </div>
    </header>
  );
}
