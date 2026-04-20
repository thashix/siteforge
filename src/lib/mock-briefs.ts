import type { SiteBrief } from "@/types";

// =============================================================================
// MOCK BRIEFS
// =============================================================================
// Pre-built SiteBrief objects for development and testing.
// These bypass the AI analysis step entirely, letting you test:
// - Site Composer (composeSite)
// - Theme Engine (palettes, fonts)
// - Section rendering (all 10 types)
// - Animations
// - Editor functionality
// =============================================================================

export const MOCK_BRIEFS: Record<string, SiteBrief> = {
  coiffeur: {
    sector: "beauty",
    businessName: "Salon Élégance",
    tagline: "L'art de la coiffure au cœur de Mons",
    tone: "elegant",
    paletteKey: "noir-gold",
    fontPairingKey: "playfair-lato",
    sections: [
      "hero",
      "services",
      "about",
      "gallery",
      "testimonials",
      "pricing",
      "faq",
      "cta",
      "contact",
      "footer",
    ],
    sectionContents: {
      hero: {
        type: "hero",
        headline: "L'Élégance au bout des doigts",
        subheadline:
          "Découvrez un salon de coiffure d'exception à Mons. Style, précision et raffinement pour sublimer votre beauté.",
        ctaText: "Prendre rendez-vous",
        ctaLink: "#contact",
      },
      services: {
        type: "services",
        title: "Nos prestations",
        subtitle:
          "Un savoir-faire artisanal au service de votre style personnel",
        items: [
          {
            title: "Coupe & Coiffage",
            description:
              "Une coupe sur-mesure qui révèle votre personnalité. Consultation personnalisée incluse.",
            icon: "💇",
          },
          {
            title: "Coloration",
            description:
              "Techniques de coloration premium : balayage, mèches, couleur complète. Produits haut de gamme.",
            icon: "🎨",
          },
          {
            title: "Soins capillaires",
            description:
              "Rituels de soin profonds pour nourrir, réparer et sublimer la fibre capillaire.",
            icon: "✨",
          },
          {
            title: "Coiffure événementielle",
            description:
              "Mariages, galas, événements. Des coiffures qui marquent les moments importants.",
            icon: "👑",
          },
          {
            title: "Barbier",
            description:
              "Taille de barbe, rasage traditionnel et soins visage pour messieurs exigeants.",
            icon: "🪒",
          },
          {
            title: "Extensions",
            description:
              "Pose d'extensions naturelles pour un volume et une longueur sur mesure.",
            icon: "💫",
          },
        ],
      },
      about: {
        type: "about",
        title: "Notre histoire",
        text: "Depuis 2015, le Salon Élégance incarne l'excellence capillaire à Mons. Fondé par Marie Dupont, notre salon allie techniques modernes et attention personnalisée. Chaque client bénéficie d'une consultation dédiée pour un résultat qui lui ressemble. Notre équipe de 5 coiffeurs passionnés se forme continuellement aux dernières tendances internationales.",
        highlights: [
          "Plus de 3000 clients satisfaits",
          "Produits professionnels premium",
          "Formation continue internationale",
          "Approche éco-responsable",
        ],
      },
      gallery: {
        type: "gallery",
        title: "Nos réalisations",
        subtitle: "Un aperçu de notre savoir-faire",
        images: [
          { alt: "Balayage blond lumineux sur cheveux longs", placeholder: "gradient" },
          { alt: "Coupe courte moderne et texturée", placeholder: "gradient" },
          { alt: "Coloration cuivrée automnale", placeholder: "gradient" },
          { alt: "Coiffure de mariée bohème chic", placeholder: "gradient" },
          { alt: "Dégradé homme soigné", placeholder: "gradient" },
          { alt: "Mèches caramel sur base brune", placeholder: "gradient" },
        ],
      },
      testimonials: {
        type: "testimonials",
        title: "Ce que disent nos clients",
        items: [
          {
            quote:
              "Un salon exceptionnel. Marie a compris exactement ce que je voulais, le résultat dépasse mes attentes. Je ne change plus !",
            author: "Sophie L.",
            role: "Cliente fidèle depuis 2019",
          },
          {
            quote:
              "Enfin un coiffeur qui prend le temps d'écouter. L'ambiance est top et le résultat toujours parfait.",
            author: "Thomas B.",
            role: "Client régulier",
          },
          {
            quote:
              "Ma coiffure de mariage était absolument magnifique. Toute l'équipe a été aux petits soins. Merci infiniment !",
            author: "Claire M.",
            role: "Mariée en juin 2024",
          },
        ],
      },
      pricing: {
        type: "pricing",
        title: "Nos tarifs",
        subtitle: "Des prestations adaptées à chaque besoin",
        plans: [
          {
            name: "Essentiel",
            price: "35€",
            features: [
              "Coupe femme ou homme",
              "Shampooing & soin",
              "Coiffage",
              "Conseils personnalisés",
            ],
            highlighted: false,
          },
          {
            name: "Signature",
            price: "75€",
            features: [
              "Coupe sur-mesure",
              "Coloration ou mèches",
              "Soin profond",
              "Coiffage & finitions",
              "Boisson offerte",
            ],
            highlighted: true,
          },
          {
            name: "Prestige",
            price: "120€",
            features: [
              "Diagnostic capillaire complet",
              "Coupe + coloration premium",
              "Rituel soin exclusif",
              "Brushing ou coiffage",
              "Produit miniature offert",
            ],
            highlighted: false,
          },
        ],
      },
      faq: {
        type: "faq",
        title: "Questions fréquentes",
        items: [
          {
            question: "Faut-il prendre rendez-vous ?",
            answer:
              "Oui, nous travaillons uniquement sur rendez-vous pour vous garantir un service de qualité et un temps dédié. Vous pouvez réserver en ligne ou par téléphone.",
          },
          {
            question: "Quels produits utilisez-vous ?",
            answer:
              "Nous travaillons exclusivement avec des marques professionnelles haut de gamme : Kérastase, L'Oréal Professionnel et Olaplex.",
          },
          {
            question: "Proposez-vous des prestations à domicile ?",
            answer:
              "Oui, pour les mariages et événements spéciaux, nous nous déplaçons. Contactez-nous pour un devis personnalisé.",
          },
          {
            question: "Comment entretenir ma coloration ?",
            answer:
              "Nous vous conseillerons les produits adaptés lors de votre visite. En général, un shampooing spécial couleur et un soin hebdomadaire suffisent.",
          },
          {
            question: "Acceptez-vous les enfants ?",
            answer:
              "Bien sûr ! Nous accueillons les enfants dès 3 ans avec des tarifs adaptés et beaucoup de patience.",
          },
        ],
      },
      cta: {
        type: "cta",
        headline: "Prêt à révéler votre style ?",
        subheadline:
          "Réservez votre créneau et vivez l'expérience Salon Élégance.",
        buttonText: "Réserver maintenant",
        buttonLink: "#contact",
      },
      contact: {
        type: "contact",
        title: "Nous contacter",
        subtitle:
          "Prenez rendez-vous ou posez-nous vos questions",
        email: "contact@salon-elegance.be",
        phone: "+32 65 12 34 56",
        address: "Rue de la Station 42, 7000 Mons, Belgique",
      },
      footer: {
        type: "footer",
        businessName: "Salon Élégance",
        tagline: "L'art de la coiffure à Mons",
        links: [
          { label: "Services", href: "#services" },
          { label: "Tarifs", href: "#pricing" },
          { label: "Contact", href: "#contact" },
        ],
        copyright: "© 2025 Salon Élégance. Tous droits réservés.",
      },
    },
    meta: {
      location: "Mons, Belgique",
      targetAudience: "Hommes et femmes recherchant un coiffeur haut de gamme",
      services: [
        "Coupe",
        "Coloration",
        "Soins capillaires",
        "Coiffure événementielle",
        "Barbier",
      ],
      language: "fr",
    },
  },

  restaurant: {
    sector: "restaurant",
    businessName: "La Table de Marie",
    tagline: "Gastronomie belge réinventée au cœur de Bruxelles",
    tone: "warm",
    paletteKey: "warm-terracotta",
    fontPairingKey: "fraunces-outfit",
    sections: [
      "hero",
      "about",
      "services",
      "gallery",
      "testimonials",
      "cta",
      "contact",
      "footer",
    ],
    sectionContents: {
      hero: {
        type: "hero",
        headline: "Une cuisine qui raconte une histoire",
        subheadline:
          "Saveurs authentiques et produits locaux sublimés. Bienvenue à La Table de Marie, restaurant gastronomique à Bruxelles.",
        ctaText: "Réserver une table",
        ctaLink: "#contact",
      },
      about: {
        type: "about",
        title: "Notre philosophie",
        text: "La Table de Marie, c'est la passion du goût et le respect du terroir belge. Notre cheffe Marie Vandenberghe sélectionne chaque produit auprès de producteurs locaux. La carte change au fil des saisons pour vous offrir le meilleur de chaque moment de l'année.",
        highlights: [
          "Produits 100% locaux et de saison",
          "Cheffe étoilée depuis 2022",
          "Carte renouvelée chaque mois",
          "Cave de 200 références",
        ],
      },
      services: {
        type: "services",
        title: "Nos expériences",
        items: [
          {
            title: "Menu Découverte",
            description: "5 plats qui racontent la Belgique à travers les saisons. Accord mets-vins disponible.",
            icon: "🍽️",
          },
          {
            title: "Menu Prestige",
            description: "8 plats signature de la cheffe avec accords de notre sommelier.",
            icon: "⭐",
          },
          {
            title: "Événements privés",
            description: "Privatisez notre salon pour vos occasions spéciales. De 10 à 30 convives.",
            icon: "🥂",
          },
        ],
      },
      gallery: {
        type: "gallery",
        title: "En images",
        images: [
          { alt: "Tartare de bœuf belge aux câpres", placeholder: "gradient" },
          { alt: "Intérieur chaleureux du restaurant", placeholder: "gradient" },
          { alt: "Dessert au chocolat belge", placeholder: "gradient" },
          { alt: "Salle privée pour événements", placeholder: "gradient" },
        ],
      },
      testimonials: {
        type: "testimonials",
        title: "Avis de nos convives",
        items: [
          {
            quote: "Une expérience culinaire inoubliable. Chaque plat est une œuvre d'art gustative.",
            author: "Pierre D.",
            role: "Guide Michelin",
          },
          {
            quote: "Le meilleur restaurant de Bruxelles, sans hésitation. Le service est impeccable.",
            author: "Anne-Sophie R.",
          },
          {
            quote: "Nous y avons fêté notre anniversaire de mariage. Un moment magique du début à la fin.",
            author: "Marc & Julie V.",
          },
        ],
      },
      cta: {
        type: "cta",
        headline: "Votre table vous attend",
        subheadline: "Réservez dès maintenant pour vivre une expérience gastronomique unique.",
        buttonText: "Réserver",
        buttonLink: "#contact",
      },
      contact: {
        type: "contact",
        title: "Réservation",
        subtitle: "Ouvert du mardi au samedi, midi et soir",
        email: "reservation@latabledmarie.be",
        phone: "+32 2 123 45 67",
        address: "Rue Haute 158, 1000 Bruxelles, Belgique",
      },
      footer: {
        type: "footer",
        businessName: "La Table de Marie",
        tagline: "Gastronomie belge réinventée",
        copyright: "© 2025 La Table de Marie. Tous droits réservés.",
      },
    },
    meta: {
      location: "Bruxelles, Belgique",
      targetAudience: "Gastronomes et amateurs de cuisine raffinée",
      services: ["Menu Découverte", "Menu Prestige", "Événements privés"],
      language: "fr",
    },
  },
};

/** Get a mock brief by key, defaults to "coiffeur" */
export function getMockBrief(key?: string): SiteBrief {
  return MOCK_BRIEFS[key || "coiffeur"] || MOCK_BRIEFS.coiffeur;
}
