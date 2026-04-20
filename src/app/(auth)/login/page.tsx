"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { login } from "@/lib/auth";

// =============================================================================
// LOGIN PAGE
// =============================================================================

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--sf-app-bg)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--sf-app-accent)] flex items-center justify-center">
              <span className="text-white font-bold text-lg">SF</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Connexion</h1>
          <p className="text-sm text-[var(--sf-app-text-muted)] mt-2">
            Connectez-vous pour accéder à vos sites
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--sf-app-text-muted)] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              className="
                w-full px-4 py-3
                bg-[var(--sf-app-surface)]
                border border-[var(--sf-app-border)]
                rounded-xl text-[var(--sf-app-text)]
                placeholder:text-[var(--sf-app-text-muted)]/40
                focus:outline-none focus:ring-2 focus:ring-[var(--sf-app-accent)]/50
                focus:border-[var(--sf-app-accent)]
                transition-all duration-150
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--sf-app-text-muted)] mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="
                w-full px-4 py-3
                bg-[var(--sf-app-surface)]
                border border-[var(--sf-app-border)]
                rounded-xl text-[var(--sf-app-text)]
                placeholder:text-[var(--sf-app-text-muted)]/40
                focus:outline-none focus:ring-2 focus:ring-[var(--sf-app-accent)]/50
                focus:border-[var(--sf-app-accent)]
                transition-all duration-150
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3.5 rounded-xl font-semibold text-white
              bg-[var(--sf-app-accent)] hover:bg-[var(--sf-app-accent-hover)]
              transition-all duration-200 cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-[var(--sf-app-text-muted)] mt-6">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-[var(--sf-app-accent)] hover:underline font-medium">
            Créer un compte
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
