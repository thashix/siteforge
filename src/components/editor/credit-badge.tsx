"use client";

import { useState, useEffect } from "react";
import { getCredits, getCreditsFromDB, setCachedBalance } from "@/lib/credits";

// =============================================================================
// CREDIT BADGE
// =============================================================================
// Compact display of credit balance, shown in toolbar/header.
// =============================================================================

interface CreditBadgeProps {
  onClickBuy?: () => void;
  className?: string;
}

export function CreditBadge({ onClickBuy, className }: CreditBadgeProps) {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    // Load from DB on mount
    getCreditsFromDB().then((b) => {
      setCachedBalance(b);
      setBalance(b);
    });

    // Poll cache for changes after actions
    const interval = setInterval(() => setBalance(getCredits()), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={onClickBuy}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5
        rounded-lg text-xs font-medium
        transition-colors cursor-pointer
        ${
          balance > 0
            ? "bg-[var(--sf-app-accent)]/10 text-[var(--sf-app-accent)] hover:bg-[var(--sf-app-accent)]/20"
            : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
        }
        ${className || ""}
      `}
      title="Crédits disponibles"
    >
      <CoinIcon />
      <span>{balance}</span>
      {balance === 0 && <span className="hidden sm:inline">— Acheter</span>}
    </button>
  );
}

function CoinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12" />
      <path d="M15 9.5c0-1.38-1.34-2.5-3-2.5s-3 1.12-3 2.5 1.34 2.5 3 2.5 3 1.12 3 2.5-1.34 2.5-3 2.5" />
    </svg>
  );
}
