import { useEffect, useMemo, useState } from "react";
import { signInUser, signUpUser } from "./auth-client";

type AuthMode = "signIn" | "signUp";

type AuthUIProps = {
  isOpen: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onAuthenticated?: (mode: AuthMode) => void;
};

const modeCopy: Record<AuthMode, { title: string; cta: string; altPrompt: string; altAction: string; altMode: AuthMode }> = {
  signIn: {
    title: "Sign in",
    cta: "Sign in",
    altPrompt: "Don't have an account?",
    altAction: "Create one",
    altMode: "signUp",
  },
  signUp: {
    title: "Create your account",
    cta: "Sign up",
    altPrompt: "Already have an account?",
    altAction: "Sign in",
    altMode: "signIn",
  },
};

export function AuthUI({ isOpen, mode, onModeChange, onClose, onAuthenticated }: AuthUIProps) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setForm({ name: "", email: "", password: "" });
    setError(null);
    setLoading(false);
  }, [isOpen, mode]);

  const isSubmitDisabled = useMemo(() => {
    if (loading) {
      return true;
    }

    if (!form.email || !form.password) {
      return true;
    }

    if (mode === "signUp" && !form.name) {
      return true;
    }

    return false;
  }, [form, loading, mode]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      if (mode === "signIn") {
        await signInUser(form.email, form.password);
      } else {
        await signUpUser(form.name, form.email, form.password);
      }

      onAuthenticated?.(mode);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const copy = modeCopy[mode];

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-8 text-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-200 transition hover:bg-white/20"
        >
          Close
        </button>

        <h2 className="text-2xl font-semibold tracking-tight text-white">{copy.title}</h2>
        <p className="mt-2 text-sm text-slate-300">
          {mode === "signIn"
            ? "Welcome back! Enter your email to continue."
            : "Unlock PitchForge and start crafting your next investor-ready deck."}
        </p>

        <div className="mt-6">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.8 10.2c.1 1.5.1 3 0 4.6c-.1 1.6-.4 3.1-.9 4.6c-.5 1.5-1.2 2.8-2.2 4c-1.1 1.1-2.4 2-4 2.6c-1.5.6-3.1.9-4.7 1c-1.6.1-3.2.1-4.8 0c-1.6-.1-3.2-.4-4.7-1c-1.5-.6-2.9-1.4-4-2.6C1.2 21.6.5 20.3.1 18.8c-.5-1.5-.8-3.1-.9-4.6c-.1-1.6-.1-3.2 0-4.8c.1-1.6.4-3.2.9-4.7c.5-1.5 1.2-2.9 2.2-4C3.7 2.6 5.1 1.8 6.6 1.2C8.1.6 9.7.3 11.3.2c1.6-.1 3.2-.1 4.8 0c1.6.1 3.1.4 4.6.9c1.5.5 2.8 1.2 4 2.2c1.1 1.1 2 2.4 2.6 4c.6 1.5.9 3.1 1 4.7zM7.9 12.1c0-1.2.3-2.3.9-3.3c.6-1 1.4-1.7 2.4-2.2c1-.5 2.1-.7 3.2-.5c1.1.2 2.1.7 2.9 1.5c.8.8 1.3 1.8 1.5 2.9c.2 1.1 0 2.2-.5 3.2c-.5 1-1.2 1.8-2.2 2.4c-1 .6-2.1.9-3.3.9c-1.2 0-2.3-.3-3.3-.9c-1-.6-1.7-1.4-2.2-2.4c-.6-1-.8-2.1-.8-3.2zm6.3-5.2c-.4.2-.7.4-1 .7c-.3.3-.6.6-.8.9c-.2.3-.4.7-.5 1.1c-.1.4-.2.8-.2 1.2c0 .4.1.8.2 1.2c.1.4.3.8.5 1.1c.2.3.5.6.8.9c.3.3.6.5 1 .7c.4.2.8.3 1.2.3c.4 0 .8-.1 1.2-.3c.4-.2.7-.4 1-.7c.3-.3.6-.6.8-.9c.2-.3.4-.7.5-1.1c.1-.4.2-.8.2-1.2c0-.4-.1-.8-.2-1.2c-.1-.4-.3-.8-.5-1.1c-.2-.3-.5-.6-.8-.9c-.3-.3-.6-.5-1-.7c-.4-.2-.8-.3-1.2-.3c-.4 0-.8.1-1.2.3zm-7.8 7.3c.1-.1.2-.2.3-.3c.1-.1.2-.2.3-.3c.1-.1.3-.2.4-.3c.1 0 .2-.1.3-.1c.3 0 .6.1.9.1c.3.1.6.2.9.3c.3.1.6.3.8.5c.3.2.5.4.7.6c.2.2.4.5.5.7c.1.3.2.6.3.9c.1.3.1.6.1.9c0 .1 0 .2-.1.3c0 .1-.1.2-.1.3s-.1.2-.2.3c-.1.1-.2.2-.3.3c-.1.1-.2.2-.3.3c-.1.1-.3.2-.4.3c-.1 0-.2.1-.3.1c-.3 0-.6-.1-.9-.1c-.3-.1-.6-.2-.9-.3c-.3-.1-.6-.3-.8-.5c-.3-.2-.5-.4-.7-.6c-.2-.2-.4-.5-.5-.7c-.1-.3-.2-.6-.3-.9c-.1-.3-.1-.6-.1-.9c0-.1 0-.2.1-.3c0-.1.1-.2.1-.3z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-900 px-2 text-slate-400">or</span>
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "signUp" && (
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-slate-200">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-white/30 focus:outline-none"
                placeholder="Your name"
                autoComplete="name"
                disabled={loading}
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-white/30 focus:outline-none"
              placeholder="[email protected]"
              autoComplete={mode === "signIn" ? "email" : "username"}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-white/30 focus:outline-none"
              placeholder="••••••••"
              autoComplete={mode === "signIn" ? "current-password" : "new-password"}
              disabled={loading}
              required
              minLength={8}
            />
          </div>

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold tracking-wide text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Please wait..." : copy.cta}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-300">
          <span>{copy.altPrompt}</span>
          <button
            type="button"
            onClick={() => onModeChange(copy.altMode)}
            className="font-medium text-white underline-offset-4 transition hover:underline"
            disabled={loading}
          >
            {copy.altAction}
          </button>
        </div>
      </div>
    </div>
  );
}


