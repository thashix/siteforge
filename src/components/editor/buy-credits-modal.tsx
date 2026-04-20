"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CREDIT_PACKS, addCredits, getCreditState, type CreditPack } from "@/lib/credits";

// =============================================================================
// BUY CREDITS MODAL
// =============================================================================
// Shows available credit packs. In MVP, simulates purchase.
// When Stripe is configured, redirects to Stripe Checkout.
// =============================================================================

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchased?: () => void;
}

export function BuyCreditsModal({ isOpen, onClose, onPurchased }: BuyCreditsModalProps) {
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const creditState = typeof window !== "undefined" ? getCreditState() : null;

  async function handleBuy(pack: CreditPack) {
    setPurchasing(pack.id);

    try {
      // Try Stripe checkout first
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId: pack.id }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
        return;
      }

      // Fallback: if Stripe not configured, simulate purchase (dev mode)
      if (data.error === "stripe_not_configured") {
        // Dev mode — add credits directly
        addCredits(pack.credits, pack.name);
        onPurchased?.();
        onClose();
      }
    } catch {
      // Offline / error — dev mode fallback
      addCredits(pack.credits, pack.name);
      onPurchased?.();
      onClose();
    } finally {
      setPurchasing(null);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-[var(--sf-app-bg)] border border-[var(--sf-app-border)] rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Acheter des crédits</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-[var(--sf-app-surface)] transition-colors cursor-pointer text-[var(--sf-app-text-muted)]"
                  >
                    ✕
                  </button>
                </div>
                {creditState && (
                  <p className="text-sm text-[var(--sf-app-text-muted)] mt-1">
                    Solde actuel : <span className="text-[var(--sf-app-accent)] font-semibold">{creditState.balance} crédits</span>
                  </p>
                )}
              </div>

              {/* Packs */}
              <div className="px-6 pb-2 grid gap-3">
                {CREDIT_PACKS.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => handleBuy(pack)}
                    disabled={purchasing !== null}
                    className={`
                      relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer
                      ${
                        pack.popular
                          ? "border-[var(--sf-app-accent)] bg-[var(--sf-app-accent)]/5 hover:bg-[var(--sf-app-accent)]/10"
                          : "border-[var(--sf-app-border)] bg-[var(--sf-app-surface)] hover:bg-[var(--sf-app-surface-hover)]"
                      }
                      ${purchasing === pack.id ? "opacity-70" : ""}
                    `}
                  >
                    {pack.popular && (
                      <span className="absolute -top-2.5 left-4 px-2 py-0.5 text-[10px] font-bold rounded-full bg-[var(--sf-app-accent)] text-white">
                        POPULAIRE
                      </span>
                    )}
                    <div className="text-left">
                      <p className="font-semibold text-sm">{pack.name}</p>
                      <p className="text-xs text-[var(--sf-app-text-muted)] mt-0.5">
                        {pack.credits} crédits
                        <span className="mx-1">•</span>
                        {Math.floor(pack.credits / 5)} site{Math.floor(pack.credits / 5) > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{pack.price}€</p>
                      <p className="text-[10px] text-[var(--sf-app-text-muted)]">
                        {(pack.price / pack.credits).toFixed(2)}€/crédit
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Credit usage info */}
              <div className="px-6 py-4 mt-2 border-t border-[var(--sf-app-border)]">
                <p className="text-[10px] text-[var(--sf-app-text-muted)] leading-relaxed">
                  💡 Coût par action : Génération IA = 5 crédits • Export HTML = 3 crédits • Régénération = 2 crédits
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
