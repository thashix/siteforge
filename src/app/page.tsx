"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// =============================================================================
// SITEFORGE LANDING PAGE
// =============================================================================
// Design direction: Dark luxury meets tech-forward. Bold typography,
// animated gradient mesh, staggered reveals, generous whitespace.
// Goal: convince visitors to try the generator immediately.
// =============================================================================

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#06060A] text-white overflow-hidden">
      {/* ---- NAV ---- */}
      <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 py-5 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center">
            <span className="text-white font-bold text-sm">SF</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">SiteForge</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/preview/demo"
            className="hidden sm:inline-flex text-sm text-white/60 hover:text-white transition-colors"
          >
            Voir la démo
          </Link>
          <Link
            href="/login"
            className="hidden sm:inline-flex text-sm text-white/60 hover:text-white transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 transition-all"
          >
            Créer un compte
          </Link>
        </div>
      </nav>

      {/* ---- HERO ---- */}
      <section className="relative px-6 sm:px-10 pt-20 sm:pt-32 pb-32 sm:pb-44 max-w-7xl mx-auto">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-[#6366F1] opacity-[0.08] blur-[150px]" />
          <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#8B5CF6] opacity-[0.06] blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-[#EC4899] opacity-[0.04] blur-[100px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Badge */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          custom={0}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Propulsé par l&apos;IA — Aucune compétence technique requise
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="text-center text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight max-w-5xl mx-auto"
        >
          Votre site pro en{" "}
          <span className="relative">
            <span className="relative z-10 bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              30 secondes
            </span>
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          custom={0.25}
          className="text-center text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mt-7 leading-relaxed"
        >
          Décrivez votre activité. SiteForge génère un site moderne,
          animé et responsive. Éditez, personnalisez, exportez.
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <Link
            href="/generate"
            className="group relative px-8 py-4 text-base font-semibold rounded-xl bg-[#6366F1] hover:bg-[#5558E6] text-white transition-all duration-200 hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]"
          >
            Créer mon site gratuitement
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/preview/demo"
            className="px-8 py-4 text-base font-medium rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-all"
          >
            Voir un exemple
          </Link>
        </motion.div>

        {/* Browser mockup */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          custom={0.6}
          className="mt-20 sm:mt-28 max-w-4xl mx-auto"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/50">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full max-w-xs mx-auto h-6 rounded-md bg-white/5 flex items-center justify-center">
                  <span className="text-[10px] text-white/30">salon-elegance.siteforge.app</span>
                </div>
              </div>
            </div>
            {/* Site preview gradient */}
            <div className="relative h-[300px] sm:h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#1A1510] to-[#0D0D0D]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8">
                  <p className="text-[#C8A45C] text-xs uppercase tracking-[0.2em] mb-3">Salon Élégance — Mons</p>
                  <p className="text-2xl sm:text-4xl font-bold text-[#F5F0E8] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    L&apos;Élégance au bout<br />des doigts
                  </p>
                  <div className="mt-6 inline-block px-6 py-2.5 rounded-lg bg-[#C8A45C] text-[#0D0D0D] text-sm font-semibold">
                    Prendre rendez-vous
                  </div>
                </div>
              </div>
              {/* Fade at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#06060A] to-transparent" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---- FEATURES ---- */}
      <section className="px-6 sm:px-10 py-28 sm:py-36 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Comment ça marche
          </h2>
          <p className="text-white/40 text-lg mt-4 max-w-xl mx-auto">
            Trois étapes. Zéro compétence technique.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 flex items-center justify-center mb-6">
                <span className="text-[#6366F1] font-bold text-lg">{i + 1}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-white/40 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---- FEATURES GRID ---- */}
      <section className="px-6 sm:px-10 py-28 sm:py-36 max-w-7xl mx-auto border-t border-white/[0.06]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Pas un simple générateur
          </h2>
          <p className="text-white/40 text-lg mt-4 max-w-xl mx-auto">
            Des sites qui ressemblent à du vrai travail de designer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.015]"
            >
              <div className="text-2xl mb-3">{feat.icon}</div>
              <h3 className="font-semibold mb-1.5">{feat.title}</h3>
              <p className="text-sm text-white/35 leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---- PALETTES SHOWCASE ---- */}
      <section className="px-6 sm:px-10 py-28 sm:py-36 max-w-7xl mx-auto border-t border-white/[0.06]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            8 palettes premium
          </h2>
          <p className="text-white/40 text-lg mt-4 max-w-xl mx-auto">
            Chaque palette est conçue pour un rendu professionnel immédiat.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {PALETTE_SHOWCASE.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group flex flex-col items-center gap-2"
            >
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${p.primary}, ${p.bg})`,
                }}
              />
              <span className="text-[10px] text-white/30 font-medium">{p.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---- FINAL CTA ---- */}
      <section className="relative px-6 sm:px-10 py-32 sm:py-44">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#6366F1] opacity-[0.06] blur-[130px]" />
          <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#EC4899] opacity-[0.04] blur-[100px]" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
          >
            Prêt à créer votre site ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/40 text-lg mt-5 max-w-lg mx-auto"
          >
            Gratuit. Pas de carte bancaire. Votre site en moins d&apos;une minute.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10"
          >
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-10 py-5 text-lg font-semibold rounded-2xl bg-[#6366F1] hover:bg-[#5558E6] text-white transition-all duration-200 hover:shadow-[0_0_60px_rgba(99,102,241,0.25)]"
            >
              Créer mon site maintenant
              <span>→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="px-6 sm:px-10 py-10 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#6366F1] flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">SF</span>
            </div>
            <span className="text-sm text-white/40">SiteForge © 2025</span>
          </div>
          <div className="flex gap-6 text-sm text-white/30">
            <Link href="/dashboard" className="hover:text-white/60 transition-colors">Dashboard</Link>
            <Link href="/generate" className="hover:text-white/60 transition-colors">Générer</Link>
            <Link href="/preview/demo" className="hover:text-white/60 transition-colors">Démo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// -- Data ---------------------------------------------------------------------

const STEPS = [
  {
    title: "Décrivez votre activité",
    description:
      "Tapez un brief en langage naturel : votre métier, le style souhaité, les sections voulues. Comme si vous parliez à un designer.",
  },
  {
    title: "L'IA compose votre site",
    description:
      "Notre moteur analyse votre brief, choisit la palette, les polices, les sections et génère tout le contenu adapté à votre secteur.",
  },
  {
    title: "Éditez et exportez",
    description:
      "Personnalisez les textes, changez le thème en un clic, réordonnez les sections. Exportez en HTML ou publiez directement.",
  },
];

const FEATURES = [
  {
    icon: "🎨",
    title: "8 palettes de couleurs",
    description: "Du noir luxueux au pastel délicat. Chaque palette testée pour le contraste et l'esthétique.",
  },
  {
    icon: "✦",
    title: "6 combinaisons typographiques",
    description: "Playfair, Fraunces, Cormorant... Des polices premium qui donnent du caractère.",
  },
  {
    icon: "⚡",
    title: "Animations intelligentes",
    description: "Animations de scroll élégantes, adaptées au ton de votre marque. Jamais gadget.",
  },
  {
    icon: "📱",
    title: "100% responsive",
    description: "Chaque site s'adapte parfaitement du mobile au grand écran. Automatiquement.",
  },
  {
    icon: "🏗️",
    title: "10 types de sections",
    description: "Hero, services, galerie, témoignages, tarifs, FAQ, contact... Tout ce qu'il faut.",
  },
  {
    icon: "↓",
    title: "Export HTML autonome",
    description: "Téléchargez un fichier HTML unique, fonctionnel partout, sans aucune dépendance.",
  },
];

const PALETTE_SHOWCASE = [
  { name: "Noir & Or", primary: "#C8A45C", bg: "#0D0D0D" },
  { name: "Ocean Blue", primary: "#2563EB", bg: "#FAFBFF" },
  { name: "Sage", primary: "#5B7553", bg: "#F8F6F1" },
  { name: "Terracotta", primary: "#C45D3E", bg: "#FBF7F4" },
  { name: "Indigo", primary: "#6366F1", bg: "#FAFAFA" },
  { name: "Blush", primary: "#D4708F", bg: "#FDF8F9" },
  { name: "Arctic", primary: "#0EA5E9", bg: "#FFFFFF" },
  { name: "Emerald", primary: "#10B981", bg: "#0A0F0D" },
];
