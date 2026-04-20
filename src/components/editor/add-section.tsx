"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SectionType, SectionContent } from "@/types";

// =============================================================================
// ADD SECTION PANEL
// =============================================================================
// Button that appears between sections in edit mode.
// Click to open a picker of available section types.
// Generates sensible default content for each type.
// =============================================================================

interface AddSectionButtonProps {
  onAdd: (type: SectionType, content: SectionContent) => void;
}

const AVAILABLE_SECTIONS: Array<{
  type: SectionType;
  label: string;
  icon: string;
  description: string;
}> = [
  { type: "hero", label: "Hero", icon: "🏠", description: "Section d'accueil avec titre et CTA" },
  { type: "services", label: "Services", icon: "⚡", description: "Grille de services ou offres" },
  { type: "about", label: "À propos", icon: "👤", description: "Présentation de l'entreprise" },
  { type: "gallery", label: "Galerie", icon: "📷", description: "Grille d'images" },
  { type: "testimonials", label: "Témoignages", icon: "💬", description: "Avis et citations clients" },
  { type: "cta", label: "Appel à l'action", icon: "🎯", description: "Bannière avec bouton d'action" },
  { type: "pricing", label: "Tarifs", icon: "💰", description: "Tableau comparatif de formules" },
  { type: "faq", label: "FAQ", icon: "❓", description: "Questions fréquemment posées" },
  { type: "contact", label: "Contact", icon: "✉️", description: "Formulaire et coordonnées" },
];

export function AddSectionButton({ onAdd }: AddSectionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSelect(type: SectionType) {
    const content = getDefaultContent(type);
    onAdd(type, content);
    setIsOpen(false);
  }

  return (
    <div className="relative flex items-center justify-center py-2 group">
      {/* Line */}
      <div className="absolute left-8 right-8 h-px bg-[var(--sf-app-accent)]/0 group-hover:bg-[var(--sf-app-accent)]/20 transition-colors" />

      {/* Plus button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative z-10 w-8 h-8 rounded-full flex items-center justify-center
          text-sm font-bold transition-all duration-200 cursor-pointer
          ${
            isOpen
              ? "bg-[var(--sf-app-accent)] text-white scale-110 rotate-45"
              : "bg-[var(--sf-app-surface)] border border-[var(--sf-app-border)] text-[var(--sf-app-text-muted)] opacity-0 group-hover:opacity-100 hover:bg-[var(--sf-app-accent)] hover:text-white hover:border-[var(--sf-app-accent)]"
          }
        `}
      >
        +
      </button>

      {/* Section picker dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 top-12 left-1/2 -translate-x-1/2 w-[360px] max-h-[400px] overflow-y-auto rounded-xl bg-[var(--sf-app-surface)] border border-[var(--sf-app-border)] shadow-2xl p-2"
            >
              <p className="text-xs text-[var(--sf-app-text-muted)] px-3 py-2 font-medium">
                Ajouter une section
              </p>
              {AVAILABLE_SECTIONS.map((section) => (
                <button
                  key={section.type}
                  onClick={() => handleSelect(section.type)}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-[var(--sf-app-surface-hover)] transition-colors cursor-pointer"
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">{section.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-[var(--sf-app-text)]">
                      {section.label}
                    </p>
                    <p className="text-xs text-[var(--sf-app-text-muted)]">
                      {section.description}
                    </p>
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// -- Default content generators -----------------------------------------------

function getDefaultContent(type: SectionType): SectionContent {
  switch (type) {
    case "hero":
      return {
        type: "hero",
        headline: "Votre titre principal ici",
        subheadline: "Décrivez votre activité en une phrase percutante qui donne envie d'en savoir plus.",
        ctaText: "En savoir plus",
        ctaLink: "#contact",
      };
    case "services":
      return {
        type: "services",
        title: "Nos services",
        subtitle: "Ce que nous proposons",
        items: [
          { title: "Service 1", description: "Description de votre premier service.", icon: "⚡" },
          { title: "Service 2", description: "Description de votre deuxième service.", icon: "🎯" },
          { title: "Service 3", description: "Description de votre troisième service.", icon: "✨" },
        ],
      };
    case "about":
      return {
        type: "about",
        title: "À propos",
        text: "Racontez votre histoire ici. Qui êtes-vous ? Quelle est votre mission ? Pourquoi vos clients vous font confiance ?",
        highlights: ["Point fort 1", "Point fort 2", "Point fort 3"],
      };
    case "gallery":
      return {
        type: "gallery",
        title: "Galerie",
        subtitle: "Nos réalisations en images",
        images: [
          { alt: "Image 1", placeholder: "gradient" },
          { alt: "Image 2", placeholder: "gradient" },
          { alt: "Image 3", placeholder: "gradient" },
          { alt: "Image 4", placeholder: "gradient" },
        ],
      };
    case "testimonials":
      return {
        type: "testimonials",
        title: "Témoignages",
        items: [
          { quote: "Un service exceptionnel, je recommande vivement !", author: "Client A.", role: "Client" },
          { quote: "Résultat au-delà de mes attentes. Merci !", author: "Client B.", role: "Client" },
          { quote: "Professionnel et à l'écoute. Parfait.", author: "Client C.", role: "Client" },
        ],
      };
    case "cta":
      return {
        type: "cta",
        headline: "Prêt à commencer ?",
        subheadline: "Contactez-nous dès maintenant pour en discuter.",
        buttonText: "Nous contacter",
        buttonLink: "#contact",
      };
    case "pricing":
      return {
        type: "pricing",
        title: "Nos tarifs",
        subtitle: "Des formules adaptées à vos besoins",
        plans: [
          { name: "Basique", price: "29€/mois", features: ["Feature 1", "Feature 2", "Feature 3"], highlighted: false },
          { name: "Pro", price: "59€/mois", features: ["Tout de Basique", "Feature 4", "Feature 5", "Feature 6"], highlighted: true },
          { name: "Business", price: "99€/mois", features: ["Tout de Pro", "Feature 7", "Feature 8", "Feature 9"], highlighted: false },
        ],
      };
    case "faq":
      return {
        type: "faq",
        title: "Questions fréquentes",
        items: [
          { question: "Votre première question ?", answer: "La réponse à cette question." },
          { question: "Votre deuxième question ?", answer: "La réponse à cette question." },
          { question: "Votre troisième question ?", answer: "La réponse à cette question." },
        ],
      };
    case "contact":
      return {
        type: "contact",
        title: "Contactez-nous",
        subtitle: "Nous serions ravis d'échanger avec vous",
        email: "contact@exemple.com",
        phone: "+32 XXX XX XX XX",
      };
    case "footer":
      return {
        type: "footer",
        businessName: "Mon entreprise",
        copyright: "© 2025 Mon entreprise. Tous droits réservés.",
      };
  }
}
