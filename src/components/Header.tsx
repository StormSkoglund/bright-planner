import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <header className="bg-white border-b border-neutral-light">
      <div className="max-w-7xl mx-auto page-container p-4 flex items-center justify-between">
        <h1 className="text-left text-brand-dark font-bold text-xl">BrightPlanner</h1>

        <nav className="hidden sm:flex items-center space-x-2">
          <Link to="/" className="px-3 py-1.5 rounded-md text-neutral-dark hover:bg-neutral-lightest transition">
            Hjem
          </Link>

          <Link to="/week-planner" className="px-3 py-1.5 rounded-md text-neutral-dark hover:bg-neutral-lightest transition">
            Ugeplan
          </Link>

          <Link to="/about" className="px-3 py-1.5 rounded-md text-neutral-dark hover:bg-neutral-lightest transition">
            Om
          </Link>
        </nav>

        <div className="sm:hidden">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Luk menu" : "Åbn menu"}
            className="p-2 rounded-md bg-neutral-lightest inline-flex items-center justify-center"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M3 5h14a1 1 0 100-2H3a1 1 0 100 2zm14 6H3a1 1 0 100 2h14a1 1 0 100-2zm0 6H3a1 1 0 100 2h14a1 1 0 100-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu (always in DOM so we can animate open/close) */}
      <div
        className={`sm:hidden border-t border-neutral-100 overflow-hidden transition-all duration-200 transform origin-top ${
          open ? "max-h-48 opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-95"
        }`}
        aria-hidden={!open}
      >
        <div className="page-container max-w-7xl mx-auto p-3 flex flex-col gap-2">
          <Link to="/" onClick={close} className="px-3 py-2 rounded-md text-neutral-dark hover:bg-neutral-lightest transition">
            Hjem
          </Link>
          <Link to="/week-planner" onClick={close} className="px-3 py-2 rounded-md text-neutral-dark hover:bg-neutral-lightest transition">
            Ugeplan
          </Link>
          <Link to="/about" onClick={close} className="px-3 py-2 rounded-md text-neutral-dark hover:bg-neutral-lightest transition">
            Om
          </Link>
        </div>
      </div>
    </header>
  );
}
