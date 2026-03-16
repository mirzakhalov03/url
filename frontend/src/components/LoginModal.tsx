import { X } from "lucide-react"

export const LoginModal = ({ setIsSignInOpen }: { setIsSignInOpen: (isOpen: boolean) => void }) => {
  return (
    <div
          role="presentation"
          onClick={() => setIsSignInOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-5 py-8 backdrop-blur-sm"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Sign in"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#151a33]"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Sign In</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300/70">
                  Continue to access your shortened links.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close sign in modal"
                onClick={() => setIsSignInOpen(false)}
                className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 dark:border-white/15 dark:bg-[#0f1327] dark:text-slate-100"
              />

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 dark:border-white/15 dark:bg-[#0f1327] dark:text-slate-100"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsSignInOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Sign In
              </button>
            </div>
          </section>
        </div>
  )
}