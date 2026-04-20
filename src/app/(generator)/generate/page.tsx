"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { SiteBrief } from "@/types";
import { composeSite } from "@/core/composer";
import { createSite } from "@/lib/site-storage";
import { hasCredits, useCredits, getCost } from "@/lib/credits";
import { CreditBadge } from "@/components/editor/credit-badge";
import { BuyCreditsModal } from "@/components/editor/buy-credits-modal";
import { InsufficientCredits } from "@/components/editor/credit-gate";

// =============================================================================
// Generate Page — Brief Wizard
// =============================================================================
// Step 1 of the generation flow.
// The user describes their business/needs. We send this to the AI analyzer.
// On success, we store the result and navigate to the preview.
// =============================================================================

/** Loading step messages shown during generation */
const LOADING_STEPS = [
  "Analyse de votre brief...",
  "Identification du secteur et du style...",
  "Sélection de la palette et des polices...",
  "Génération du contenu...",
  "Composition des sections...",
  "Finalisation de votre site...",
];

export default function GeneratePage() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const canSubmit = description.trim().length >= 10;
  const hasEnoughCredits = hasCredits("generate");

  async function handleGenerate() {
    if (!canSubmit || isGenerating) return;

    // Check credits
    if (!hasCredits("generate")) {
      setShowBuyModal(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setLoadingStep(0);

    // Animate through loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) =>
        prev < LOADING_STEPS.length - 1 ? prev + 1 : prev
      );
    }, 2500);

    try {
      const response = await fetch("/api/brief/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          businessName: businessName || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const brief = result.data as SiteBrief;

        // Deduct credits
        useCredits("generate");

        // Compose SiteBrief → SiteConfig
        const config = composeSite(brief);

        // Save to storage (localStorage for MVP)
        const site = createSite(
          brief.businessName || businessName || "Mon site",
          brief,
          config
        );

        // Navigate to the saved site's preview
        router.push(`/preview/${site.id}`);
      } else {
        setError(
          result.error || "Une erreur est survenue lors de la génération."
        );
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3rem)]">
      {/* Fullscreen loading overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--sf-app-bg)]/95 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-2 border-[var(--sf-app-accent)] border-t-transparent rounded-full mb-6"
            />
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-lg font-medium text-[var(--sf-app-text)]"
              >
                {LOADING_STEPS[loadingStep]}
              </motion.p>
            </AnimatePresence>
            <div className="flex gap-1.5 mt-6">
              {LOADING_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    i <= loadingStep
                      ? "bg-[var(--sf-app-accent)]"
                      : "bg-[var(--sf-app-border)]"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight mb-3">
            Décrivez votre site
          </h1>
          <p className="text-[var(--sf-app-text-muted)] text-lg">
            Dites-nous tout : votre activité, le style souhaité, les
            fonctionnalités...
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Business Name */}
          <div>
            <label
              htmlFor="businessName"
              className="block text-sm font-medium text-[var(--sf-app-text-muted)] mb-2"
            >
              Nom de votre entreprise{" "}
              <span className="text-[var(--sf-app-text-muted)]/60">
                (optionnel)
              </span>
            </label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="ex: Salon Élégance"
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

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[var(--sf-app-text-muted)] mb-2"
            >
              Décrivez votre projet
            </label>
            <textarea
              id="description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`ex: Je suis coiffeur à Mons, je veux un site élégant noir et or, moderne, avec une galerie de mes réalisations, des témoignages clients, mes tarifs et un formulaire de contact.`}
              className="
                w-full px-4 py-3
                bg-[var(--sf-app-surface)]
                border border-[var(--sf-app-border)]
                rounded-xl text-[var(--sf-app-text)]
                placeholder:text-[var(--sf-app-text-muted)]/40
                focus:outline-none focus:ring-2 focus:ring-[var(--sf-app-accent)]/50
                focus:border-[var(--sf-app-accent)]
                transition-all duration-150
                resize-none
              "
            />
            <p className="mt-2 text-xs text-[var(--sf-app-text-muted)]/60">
              {description.length}/2000 — Plus vous êtes précis, meilleur sera
              le résultat.
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Credit warning */}
          {!hasEnoughCredits && canSubmit && (
            <InsufficientCredits action="generate" onBuyCredits={() => setShowBuyModal(true)} />
          )}

          {/* Submit */}
          <motion.button
            onClick={handleGenerate}
            disabled={!canSubmit || isGenerating}
            whileHover={canSubmit && !isGenerating ? { scale: 1.01 } : undefined}
            whileTap={canSubmit && !isGenerating ? { scale: 0.99 } : undefined}
            className={`
              w-full py-4 rounded-xl font-semibold text-white
              transition-all duration-200
              ${
                canSubmit && !isGenerating
                  ? "bg-[var(--sf-app-accent)] hover:bg-[var(--sf-app-accent-hover)] cursor-pointer"
                  : "bg-[var(--sf-app-border)] cursor-not-allowed text-[var(--sf-app-text-muted)]"
              }
            `}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-3">
                <Spinner />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={loadingStep}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {LOADING_STEPS[loadingStep]}
                  </motion.span>
                </AnimatePresence>
              </span>
            ) : (
              "Générer mon site"
            )}
          </motion.button>

          {/* Examples */}
          <div className="pt-4">
            <p className="text-xs text-[var(--sf-app-text-muted)]/60 mb-3 text-center">
              Exemples de briefs
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLE_BRIEFS.map((brief) => (
                <button
                  key={brief.label}
                  onClick={() => {
                    setDescription(brief.text);
                    setBusinessName(brief.name);
                  }}
                  className="
                    px-3 py-1.5 text-xs rounded-lg
                    bg-[var(--sf-app-surface)] border border-[var(--sf-app-border)]
                    text-[var(--sf-app-text-muted)]
                    hover:text-[var(--sf-app-text)] hover:border-[var(--sf-app-accent)]/30
                    transition-colors duration-150
                  "
                >
                  {brief.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Buy credits modal */}
      <BuyCreditsModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
      />
    </div>
  );
}

// -- Example Briefs -----------------------------------------------------------

const EXAMPLE_BRIEFS = [
  {
    label: "Coiffeur",
    name: "Salon Élégance",
    text: "Je suis coiffeur à Mons. Je veux un site élégant noir et or, moderne, avec une galerie de mes réalisations, des témoignages clients, mes tarifs et un formulaire de contact.",
  },
  {
    label: "Restaurant",
    name: "La Table de Marie",
    text: "Restaurant gastronomique belge à Bruxelles. Je veux un site chaleureux et raffiné avec notre menu, des photos de nos plats, les avis clients, la réservation et notre histoire.",
  },
  {
    label: "Coach sportif",
    name: "FitPro Coaching",
    text: "Coach sportif indépendant. Site dynamique et moderne, couleurs vives, avec mes programmes, témoignages de transformation, tarifs et prise de rendez-vous.",
  },
  {
    label: "Photographe",
    name: "Studio Lumière",
    text: "Photographe portrait et mariage. Je veux un site minimaliste et épuré, centré sur ma galerie, avec une section à propos, mes formules et un formulaire de contact.",
  },
];

// -- Spinner ------------------------------------------------------------------

function Spinner() {
  return (
    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="3" strokeLinecap="round"
        className="opacity-20"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor" strokeWidth="3" strokeLinecap="round"
      />
    </svg>
  );
}
