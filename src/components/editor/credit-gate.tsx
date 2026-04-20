"use client";

import { hasCredits, getCost, type CreditAction } from "@/lib/credits";

// =============================================================================
// CREDIT GATE
// =============================================================================
// Checks if user has enough credits before allowing an action.
// If not enough, shows the cost and a "buy" button.
// =============================================================================

interface CreditGateProps {
  action: CreditAction;
  onBuyCredits: () => void;
  children: (props: { canProceed: boolean; cost: number }) => React.ReactNode;
}

export function CreditGate({ action, onBuyCredits, children }: CreditGateProps) {
  const canProceed = hasCredits(action);
  const cost = getCost(action);

  return <>{children({ canProceed, cost })}</>;
}

/** Simple inline message when credits are insufficient */
export function InsufficientCredits({
  action,
  onBuyCredits,
}: {
  action: CreditAction;
  onBuyCredits: () => void;
}) {
  const cost = getCost(action);
  const labels: Record<CreditAction, string> = {
    generate: "générer un site",
    regenerate: "modifier avec l'IA",
    export: "exporter",
    addSection: "ajouter une section",
    addPage: "ajouter une page",
    rewrite: "réécrire un texte",
  };

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
      <div className="text-amber-400 text-sm">
        <p className="font-medium">
          {cost} crédits nécessaires pour {labels[action]}
        </p>
        <p className="text-xs text-amber-400/70 mt-0.5">
          Achetez des crédits pour continuer
        </p>
      </div>
      <button
        onClick={onBuyCredits}
        className="ml-auto px-4 py-2 text-xs font-medium rounded-lg bg-[var(--sf-app-accent)] text-white hover:bg-[var(--sf-app-accent-hover)] transition-colors cursor-pointer flex-shrink-0"
      >
        Acheter des crédits
      </button>
    </div>
  );
}
