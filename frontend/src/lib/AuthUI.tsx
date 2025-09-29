import { useEffect, useMemo, useState } from "react";
import { signInUser, signUpUser, signInWithGoogle } from "./auth-client";

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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onAuthenticated?.("signIn");
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M21.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.3c-.2 1.4-.9 2.6-2.1 3.4v2.7h3.5c2-1.9 3.2-4.7 3.2-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.5-2.7c-.9.6-2.1 1-3.1 1-2.4 0-4.4-1.6-5.1-3.8H3.4v2.8C5.1 20.1 8.3 22 12 22z"
              />
              <path
                fill="#FBBC05"
                d="M6.9 14.1c-.2-.6-.3-1.2-.3-1.8s.1-1.3.3-1.8V7.7H3.4C2.5 9.6 2 11.7 2 14s.5 4.4 1.4 6.3l3.5-2.8z"
              />
              <path
                fill="#EA4335"
                d="M12 6.2c1.5 0 2.8.5 3.8 1.5l3.1-3.1C16.9 2.5 14.7 2 12 2 8.3 2 5.1 3.9 3.4 6.9l3.5 2.8c.7-2.2 2.7-3.8 5.1-3.5z"
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


