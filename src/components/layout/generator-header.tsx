"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditBadge } from "@/components/editor/credit-badge";
import { BuyCreditsModal } from "@/components/editor/buy-credits-modal";

export function GeneratorHeader() {
  const [showBuyModal, setShowBuyModal] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--sf-app-border)]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[var(--sf-app-accent)] flex items-center justify-center">
            <span className="text-white font-bold text-xs">SF</span>
          </div>
          <span className="font-semibold tracking-tight">SiteForge</span>
        </Link>

        <div className="flex items-center gap-3">
          <CreditBadge onClickBuy={() => setShowBuyModal(true)} />
          <Link
            href="/dashboard"
            className="text-sm text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] transition-colors"
          >
            Retour au dashboard
          </Link>
        </div>
      </header>

      <BuyCreditsModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
      />
    </>
  );
}
