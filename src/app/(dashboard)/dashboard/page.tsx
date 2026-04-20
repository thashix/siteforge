"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getAllSites, deleteSite, type StoredSite } from "@/lib/site-storage";
import { PALETTES } from "@/core/theme";

// =============================================================================
// Dashboard — Home
// =============================================================================
// Lists all saved sites with visual preview cards.
// Sites are loaded from localStorage (MVP) / Supabase (future).
// =============================================================================

interface HtmlSite {
  id: string;
  name: string;
  html: string;
  description: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [sites, setSites] = useState<StoredSite[]>([]);
  const [htmlSites, setHtmlSites] = useState<HtmlSite[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSites(getAllSites());
    setHtmlSites(JSON.parse(localStorage.getItem("siteforge_html_sites") || "[]"));
    setLoaded(true);
  }, []);

  function handleDelete(id: string, name: string) {
    if (window.confirm(`Supprimer "${name}" ?`)) {
      deleteSite(id);
      setSites(getAllSites());
    }
  }

  function handleDeleteHtml(id: string, name: string) {
    if (window.confirm(`Supprimer "${name}" ?`)) {
      const updated = htmlSites.filter((s) => s.id !== id);
      localStorage.setItem("siteforge_html_sites", JSON.stringify(updated));
      setHtmlSites(updated);
    }
  }

  if (!loaded) return null;

  const allEmpty = sites.length === 0 && htmlSites.length === 0;

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mes sites</h1>
          <p className="text-[var(--sf-app-text-muted)] mt-1">
            {sites.length > 0
              ? `${sites.length} site${sites.length > 1 ? "s" : ""} créé${sites.length > 1 ? "s" : ""}`
              : "Gérez et modifiez vos sites générés"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/preview/demo"
            className="
              inline-flex items-center gap-2 px-4 py-2.5
              border border-[var(--sf-app-border)]
              text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)]
              text-sm font-medium rounded-lg
              transition-colors duration-150
            "
          >
            Démo
          </Link>
          <Link
            href="/generate"
            className="
              inline-flex items-center gap-2 px-5 py-2.5
              bg-[var(--sf-app-accent)] hover:bg-[var(--sf-app-accent-hover)]
              text-white text-sm font-medium rounded-lg
              transition-colors duration-150
            "
          >
            <PlusIcon className="w-4 h-4" />
            Nouveau site
          </Link>
        </div>
      </div>

      {allEmpty ? (
        /* Empty State */
        <div
          className="
            flex flex-col items-center justify-center
            py-24 px-8
            border border-dashed border-[var(--sf-app-border)]
            rounded-2xl text-center
          "
        >
          <div
            className="
              w-16 h-16 mb-6 rounded-2xl bg-[var(--sf-app-accent)]/10
              flex items-center justify-center
            "
          >
            <RocketIcon className="w-8 h-8 text-[var(--sf-app-accent)]" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Aucun site pour l&apos;instant
          </h2>
          <p className="text-[var(--sf-app-text-muted)] max-w-md mb-8">
            Décrivez votre activité et laissez SiteForge générer un site
            professionnel, moderne et animé en quelques secondes.
          </p>
          <Link
            href="/generate"
            className="
              inline-flex items-center gap-2 px-6 py-3
              bg-[var(--sf-app-accent)] hover:bg-[var(--sf-app-accent-hover)]
              text-white font-medium rounded-lg
              transition-colors duration-150
            "
          >
            Créer mon premier site
          </Link>
          <Link
            href="/preview/demo"
            className="
              inline-flex items-center gap-2 px-6 py-3 mt-3
              border border-[var(--sf-app-border)]
              text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)]
              font-medium rounded-lg transition-colors duration-150
            "
          >
            Voir la démo
          </Link>
        </div>
      ) : (
        <>
          {/* Site Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {sites.map((site, i) => (
                <SiteCard
                  key={site.id}
                  site={site}
                  index={i}
                  onOpen={() => router.push(`/preview/${site.id}`)}
                  onDelete={() => handleDelete(site.id, site.name)}
                />
              ))}
            </AnimatePresence>

            {/* New site card */}
            <Link
              href="/generate"
              className="
                flex flex-col items-center justify-center
                min-h-[220px] rounded-2xl
                border-2 border-dashed border-[var(--sf-app-border)]
                hover:border-[var(--sf-app-accent)]/40
                text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-accent)]
                transition-all duration-200
              "
            >
              <PlusIcon className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-sm font-medium">Nouveau site</span>
            </Link>
          </div>

          {/* HTML Sites (Approach A — Premium) */}
          {htmlSites.length > 0 && (
            <div className="mt-10">
              <h3 className="text-sm font-medium text-[var(--sf-app-text-muted)] mb-4">Sites générés (Premium)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {htmlSites.map((site, i) => (
                  <motion.div
                    key={site.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group rounded-2xl border border-[var(--sf-app-border)] overflow-hidden hover:border-[var(--sf-app-accent)]/30 transition-all duration-200 bg-[var(--sf-app-surface)]"
                  >
                    <div className="h-32 bg-gradient-to-br from-[var(--sf-app-accent)]/20 to-[var(--sf-app-accent)]/5 flex items-center justify-center">
                      <span className="text-2xl font-bold opacity-20" style={{ fontFamily: "serif" }}>{site.name.charAt(0)}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-1 truncate">{site.name}</h3>
                      <p className="text-[11px] text-[var(--sf-app-text-muted)] mb-3">
                        {new Date(site.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                      <div className="flex gap-2">
                        <Link
                          href={`/preview/html/${site.id}`}
                          className="flex-1 text-center px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--sf-app-accent)] text-white hover:bg-[var(--sf-app-accent-hover)] transition-colors"
                        >
                          Ouvrir
                        </Link>
                        <button
                          onClick={() => handleDeleteHtml(site.id, site.name)}
                          className="px-3 py-1.5 text-xs rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// -- Site Card ----------------------------------------------------------------

function SiteCard({
  site,
  index,
  onOpen,
  onDelete,
}: {
  site: StoredSite;
  index: number;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const config = site.config as { theme?: { paletteKey?: string; colors?: { primary?: string; background?: string; secondary?: string } } };
  const palette = config.theme?.paletteKey
    ? PALETTES[config.theme.paletteKey]
    : null;
  const colors = palette || config.theme?.colors;

  const timeAgo = getTimeAgo(site.updatedAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="group rounded-2xl border border-[var(--sf-app-border)] bg-[var(--sf-app-surface)] overflow-hidden hover:border-[var(--sf-app-accent)]/30 transition-all duration-200"
    >
      {/* Color preview header */}
      <div
        className="h-28 relative cursor-pointer"
        onClick={onOpen}
        style={{
          background: colors
            ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary || colors.background} 100%)`
            : "var(--sf-app-surface)",
        }}
      >
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
              site.status === "published"
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-white/20 text-white/80"
            }`}
          >
            {site.status === "published" ? "Publié" : "Brouillon"}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Ouvrir →
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3
              className="font-semibold text-sm truncate cursor-pointer hover:text-[var(--sf-app-accent)] transition-colors"
              onClick={onOpen}
            >
              {site.name}
            </h3>
            <p className="text-xs text-[var(--sf-app-text-muted)] mt-1">
              Modifié {timeAgo}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Supprimer"
            className="p-1.5 rounded-md text-[var(--sf-app-text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// -- Helpers ------------------------------------------------------------------

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

// -- Icons --------------------------------------------------------------------

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" /><path d="M5 12h14" />
    </svg>
  );
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
