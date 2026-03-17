import { Moon, Scissors, Sun } from "lucide-react";

export const Navbar = ({ isDark, setIsDark, setIsSignInOpen }: { isDark: boolean; setIsDark: (isDark: boolean) => void; setIsSignInOpen: (isOpen: boolean) => void }) => {
  return (
    <header className="relative z-10 border-b border-slate-200/70 dark:border-white/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/35">
              <Scissors size={16} />
            </div>
            <span className="text-2xl font-semibold tracking-tight">Snip</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setIsDark(!isDark)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-white/10"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              type="button"
              onClick={() => setIsSignInOpen(true)}
              className="rounded-full border border-slate-300/90 bg-white/70 px-5 py-1.5 text-base font-medium text-slate-900 backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>
  );
}