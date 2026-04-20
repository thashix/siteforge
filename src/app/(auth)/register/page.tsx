"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { register } from "@/lib/auth";

// =============================================================================
// REGISTER PAGE
// =============================================================================

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await register(email, password, name);

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
          <h1 className="text-2xl font-bold tracking-tight">Créer un compte</h1>
          <p className="text-sm text-[var(--sf-app-text-muted)] mt-2">
            Commencez à créer des sites professionnels
          </p>
        </div>

        {/* Bonus badge */}
        <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-emerald-400 text-sm">🎁</span>
          <span className="text-emerald-400 text-sm font-medium">
            5 crédits offerts à l&apos;inscription
          </span>
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
              Nom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
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
              placeholder="Minimum 6 caractères"
              required
              minLength={6}
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
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-[var(--sf-app-text-muted)] mt-6">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-[var(--sf-app-accent)] hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
