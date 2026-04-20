"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { addCredits, getCredits } from "@/lib/credits";

// =============================================================================
// CREDITS SUCCESS PAGE
// =============================================================================

export default function CreditsSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--sf-app-bg)]">
      <div className="w-8 h-8 border-2 border-[var(--sf-app-accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const [credited, setCredited] = useState(false);
  const [balance, setBalance] = useState(0);

  const packName = searchParams.get("pack") || "unknown";
  const credits = parseInt(searchParams.get("credits") || "0", 10);

  useEffect(() => {
    if (credits > 0 && !credited) {
      addCredits(credits, packName);
      setCredited(true);
      setBalance(getCredits());
    }
  }, [credits, packName, credited]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--sf-app-bg)] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </motion.div>

        <h1 className="text-2xl font-bold mb-2">Paiement confirmé !</h1>
        <p className="text-[var(--sf-app-text-muted)] mb-2">
          {credits > 0 ? (
            <>
              <span className="text-[var(--sf-app-accent)] font-semibold">{credits} crédits</span> ont été ajoutés à votre compte.
            </>
          ) : (
            "Vos crédits ont été ajoutés."
          )}
        </p>
        <p className="text-sm text-[var(--sf-app-text-muted)] mb-8">
          Solde actuel : <span className="font-semibold text-[var(--sf-app-text)]">{balance} crédits</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/generate"
            className="px-6 py-3 bg-[var(--sf-app-accent)] hover:bg-[var(--sf-app-accent-hover)] text-white font-medium rounded-lg transition-colors"
          >
            Créer un site
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-[var(--sf-app-border)] text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] font-medium rounded-lg transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
