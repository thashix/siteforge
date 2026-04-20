"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SectionConfig, SectionContent } from "@/types";
import { hasCredits, useCredits, getCost } from "@/lib/credits";

// =============================================================================
// SECTION AI CHAT
// =============================================================================
// Mini-chat overlay attached to a section in edit mode.
// The user types a request ("rends le titre plus accrocheur"),
// the AI modifies the section content and returns it.
//
// Credit costs:
//   - Modify section content: 3 credits
//   - Add items to a section: 3 credits
//   - Rewrite text: 2 credits
// =============================================================================

interface SectionAIChatProps {
  section: SectionConfig;
  siteContext: {
    businessName: string;
    sector: string;
    tone: string;
  };
  onUpdate: (content: SectionContent) => void;
  onClose: () => void;
  onBuyCredits: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export function SectionAIChat({
  section,
  siteContext,
  onUpdate,
  onClose,
  onBuyCredits,
}: SectionAIChatProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const CREDIT_COST = 3;

  async function handleSend() {
    if (!input.trim() || loading) return;

    // Check credits
    if (!hasCredits("regenerate")) {
      setError(`${getCost("regenerate")} crédits nécessaires`);
      onBuyCredits();
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setError(null);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: Date.now() },
    ]);

    setLoading(true);

    try {
      const response = await fetch("/api/section/modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instruction: userMessage,
          section: {
            type: section.type,
            variant: section.variant,
            content: section.content,
          },
          context: siteContext,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Deduct credits
        useCredits("regenerate");

        // Update section content
        onUpdate(result.data);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result.message || "Section mise à jour ✓",
            timestamp: Date.now(),
          },
        ]);
      } else {
        setError(result.error || "Erreur lors de la modification");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Erreur : ${result.error || "Impossible de modifier la section"}`,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  // Suggested prompts based on section type
  const suggestions = getSuggestions(section.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute top-12 right-3 z-[60] w-[360px] bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <span className="text-sm">✨</span>
          <span className="text-xs font-medium text-white">
            Modifier : {section.type}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#6366F1]/10 text-[#6366F1]">
            {CREDIT_COST} crédits
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-[#27272A] transition-colors cursor-pointer text-[#A1A1AA]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" /><path d="M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="max-h-[200px] overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-[11px] text-[#A1A1AA]">
              Demandez à l&apos;IA de modifier cette section :
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s)}
                  className="text-[10px] px-2.5 py-1.5 rounded-lg bg-[#27272A] text-[#A1A1AA] hover:text-white hover:bg-[#3f3f46] transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#6366F1] text-white"
                  : "bg-[#27272A] text-[#E4E4E7]"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#27272A] px-3 py-2 rounded-xl">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: "0s" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: "0.15s" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 pb-2">
          <p className="text-[10px] text-red-400">{error}</p>
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-3 border-t border-[#27272A]">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Ex: Rends le titre plus accrocheur..."
          disabled={loading}
          className="flex-1 bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#52525B] outline-none focus:border-[#6366F1]/50 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="p-2 rounded-lg bg-[#6366F1] text-white disabled:opacity-30 cursor-pointer transition-opacity hover:bg-[#5558E6]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

// -- Suggested prompts per section type ---------------------------------------

function getSuggestions(type: string): string[] {
  const suggestions: Record<string, string[]> = {
    hero: [
      "Rends le titre plus percutant",
      "Change le sous-titre",
      "Modifie le texte du bouton",
      "Ton plus luxueux",
    ],
    services: [
      "Ajoute un nouveau service",
      "Réécris les descriptions",
      "Change les icônes",
      "Rends ça plus professionnel",
    ],
    about: [
      "Réécris le texte",
      "Ajoute des points forts",
      "Ton plus chaleureux",
      "Raccourcis le texte",
    ],
    gallery: [
      "Change les descriptions",
      "Ajoute plus d'images",
      "Descriptions plus poétiques",
    ],
    testimonials: [
      "Ajoute un témoignage",
      "Rends les avis plus crédibles",
      "Ajoute des rôles/titres",
    ],
    cta: [
      "Titre plus accrocheur",
      "Crée de l'urgence",
      "Ton plus décontracté",
    ],
    pricing: [
      "Ajoute une formule",
      "Modifie les prix",
      "Ajoute des features",
      "Renomme les plans",
    ],
    faq: [
      "Ajoute une question",
      "Améliore les réponses",
      "Questions plus pertinentes",
    ],
    contact: [
      "Change les horaires",
      "Modifie l'adresse",
      "Ajoute un message d'accueil",
    ],
    footer: [
      "Ajoute des liens",
      "Change le copyright",
      "Modifie le slogan",
    ],
  };

  return suggestions[type] || ["Améliore cette section", "Réécris le contenu"];
}
