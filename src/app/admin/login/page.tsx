import { loginAction } from "./actions";

export const metadata = { title: "Admin Login" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">
            Blitz Jerseys
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">
            Admin
          </h1>
        </div>

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300"
              placeholder="Enter admin password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-600 active:scale-95"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
