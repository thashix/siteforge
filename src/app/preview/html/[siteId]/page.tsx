"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditBadge } from "@/components/editor/credit-badge";
import { BuyCreditsModal } from "@/components/editor/buy-credits-modal";
import { hasCredits, useCredits } from "@/lib/credits";

// =============================================================================
// HTML PREVIEW PAGE
// =============================================================================
// Displays an AI-generated HTML site in an iframe.
// Toolbar: edit with AI chat, export HTML, save, delete.
// =============================================================================

interface HtmlSite {
  id: string;
  name: string;
  html: string;
  description: string;
  createdAt: string;
}

export default function HtmlPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.siteId as string;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [site, setSite] = useState<HtmlSite | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);

  useEffect(() => {
    const sites: HtmlSite[] = JSON.parse(localStorage.getItem("siteforge_html_sites") || "[]");
    const found = sites.find((s) => s.id === siteId);
    if (found) setSite(found);
  }, [siteId]);

  useEffect(() => {
    if (site && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(site.html);
        doc.close();
      }
    }
  }, [site]);

  function handleExport() {
    if (!site) return;
    const blob = new Blob([site.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${site.name || "site"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleDelete() {
    if (!window.confirm("Supprimer ce site ? Cette action est irréversible.")) return;
    const sites: HtmlSite[] = JSON.parse(localStorage.getItem("siteforge_html_sites") || "[]");
    localStorage.setItem("siteforge_html_sites", JSON.stringify(sites.filter((s) => s.id !== siteId)));
    router.push("/dashboard");
  }

  async function handleChatSend() {
    if (!chatInput.trim() || chatLoading || !site) return;

    if (!hasCredits("regenerate")) {
      setShowBuyModal(true);
      return;
    }

    const instruction = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: instruction }]);
    setChatLoading(true);

    try {
      const response = await fetch("/api/generate/modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: site.html, instruction }),
      });

      const result = await response.json();

      if (result.success && result.html) {
        useCredits("regenerate");

        // Update site
        const updatedSite = { ...site, html: result.html };
        setSite(updatedSite);

        // Update localStorage
        const sites: HtmlSite[] = JSON.parse(localStorage.getItem("siteforge_html_sites") || "[]");
        const idx = sites.findIndex((s) => s.id === siteId);
        if (idx !== -1) {
          sites[idx] = updatedSite;
          localStorage.setItem("siteforge_html_sites", JSON.stringify(sites));
        }

        // Refresh iframe
        if (iframeRef.current) {
          const doc = iframeRef.current.contentDocument;
          if (doc) { doc.open(); doc.write(result.html); doc.close(); }
        }

        setChatMessages((prev) => [...prev, { role: "assistant", content: "✓ Site modifié avec succès" }]);
      } else {
        setChatMessages((prev) => [...prev, { role: "assistant", content: `Erreur: ${result.error}` }]);
      }
    } catch {
      setChatMessages((prev) => [...prev, { role: "assistant", content: "Erreur de connexion" }]);
    } finally {
      setChatLoading(false);
    }
  }

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--sf-app-bg)]">
        <div className="text-center">
          <p className="text-[var(--sf-app-text-muted)] mb-4">Site introuvable</p>
          <Link href="/dashboard" className="text-[var(--sf-app-accent)]">Retour au dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--sf-app-bg)]">
      {/* Toolbar */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--sf-app-border)] bg-[var(--sf-app-bg)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[var(--sf-app-accent)] flex items-center justify-center">
              <span className="text-white font-bold text-xs">SF</span>
            </div>
          </Link>
          <span className="text-sm font-medium">{site.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <CreditBadge onClickBuy={() => setShowBuyModal(true)} />

          {/* AI Edit button */}
          <button
            onClick={() => setShowChat(!showChat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              showChat
                ? "bg-[var(--sf-app-accent)] text-white"
                : "bg-[var(--sf-app-surface)] text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)]"
            }`}
          >
            ✨ Modifier avec l&apos;IA
          </button>

          {/* Export */}
          <button
            onClick={handleExport}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--sf-app-surface)] text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] transition-colors cursor-pointer"
          >
            📥 Exporter HTML
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            🗑
          </button>

          <Link
            href="/dashboard"
            className="px-3 py-1.5 text-xs text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Site preview iframe */}
        <div className="flex-1">
          <iframe
            ref={iframeRef}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts allow-same-origin"
            title={site.name}
          />
        </div>

        {/* AI Chat panel */}
        {showChat && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0 border-l border-[var(--sf-app-border)] flex flex-col bg-[var(--sf-app-bg)]"
          >
            <div className="px-4 py-3 border-b border-[var(--sf-app-border)]">
              <h3 className="text-sm font-medium flex items-center gap-2">
                ✨ Modifier le site
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--sf-app-accent)]/10 text-[var(--sf-app-accent)]">
                  3 crédits/modif
                </span>
              </h3>
              <p className="text-[11px] text-[var(--sf-app-text-muted)] mt-1">
                Décrivez les changements à apporter
              </p>
            </div>

            {/* Suggestions */}
            {chatMessages.length === 0 && (
              <div className="px-4 py-3 space-y-1.5">
                {[
                  "Change les couleurs en bleu et blanc",
                  "Modifie le titre principal",
                  "Ajoute un service supplémentaire",
                  "Rends le design plus épuré",
                  "Change les images pour quelque chose de plus moderne",
                  "Traduis tout en anglais",
                ].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setChatInput(s)}
                    className="block w-full text-left text-[11px] px-3 py-2 rounded-lg bg-[var(--sf-app-surface)] text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] hover:bg-[var(--sf-app-surface-hover)] transition-colors cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${
                    msg.role === "user"
                      ? "bg-[var(--sf-app-accent)] text-white"
                      : "bg-[var(--sf-app-surface)] text-[var(--sf-app-text)]"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--sf-app-surface)] px-3 py-2 rounded-xl flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--sf-app-accent)] animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--sf-app-accent)] animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--sf-app-accent)] animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-[var(--sf-app-border)] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleChatSend(); }}
                placeholder="Ex: Change le titre en..."
                disabled={chatLoading}
                className="flex-1 bg-[var(--sf-app-surface)] border border-[var(--sf-app-border)] rounded-lg px-3 py-2 text-xs outline-none focus:border-[var(--sf-app-accent)]/50 disabled:opacity-50"
              />
              <button
                onClick={handleChatSend}
                disabled={chatLoading || !chatInput.trim()}
                className="px-3 py-2 rounded-lg bg-[var(--sf-app-accent)] text-white disabled:opacity-30 cursor-pointer text-xs"
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <BuyCreditsModal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} />
    </div>
  );
}
