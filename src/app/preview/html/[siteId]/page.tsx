"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CreditBadge } from "@/components/editor/credit-badge";
import { BuyCreditsModal } from "@/components/editor/buy-credits-modal";
import { hasCredits, useCredits } from "@/lib/credits";

// =============================================================================
// HTML PREVIEW PAGE — with Inline Editing
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
  const [editMode, setEditMode] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [saving, setSaving] = useState(false);

  // Load site
  useEffect(() => {
    const sites: HtmlSite[] = JSON.parse(localStorage.getItem("siteforge_html_sites") || "[]");
    const found = sites.find((s) => s.id === siteId);
    if (found) setSite(found);
  }, [siteId]);

  // Write HTML to iframe
  const writeToIframe = useCallback((html: string) => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
  }, []);

  // Initial render
  useEffect(() => {
    if (site) writeToIframe(site.html);
  }, [site, writeToIframe]);

  // Enable inline editing mode
  useEffect(() => {
    if (!site || !iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    if (editMode) {
      // Inject editing CSS + JS into the iframe
      const editScript = doc.createElement("script");
      editScript.textContent = `
        (function() {
          // Add edit mode styles
          var style = document.createElement('style');
          style.id = 'sf-edit-styles';
          style.textContent = \`
            [data-editable="text"]:hover {
              outline: 2px solid #6366F1 !important;
              outline-offset: 2px;
              cursor: text !important;
            }
            [data-editable="text"][contenteditable="true"] {
              outline: 2px solid #6366F1 !important;
              outline-offset: 2px;
              background: rgba(99, 102, 241, 0.05) !important;
            }
            [data-editable="image"]:hover {
              outline: 2px dashed #F59E0B !important;
              outline-offset: 2px;
              cursor: pointer !important;
            }
            [data-editable="section"]:hover {
              outline: 1px dashed rgba(99, 102, 241, 0.3) !important;
              outline-offset: -1px;
            }
            .sf-edit-badge {
              position: fixed; top: 8px; left: 50%; transform: translateX(-50%);
              background: #6366F1; color: white; padding: 6px 16px;
              border-radius: 20px; font-size: 12px; font-family: sans-serif;
              z-index: 99999; pointer-events: none;
            }
          \`;
          document.head.appendChild(style);

          // Add edit badge
          var badge = document.createElement('div');
          badge.className = 'sf-edit-badge';
          badge.textContent = 'Mode édition — Cliquez sur un texte pour le modifier';
          document.body.appendChild(badge);

          // Make text elements editable on click
          document.querySelectorAll('[data-editable="text"]').forEach(function(el) {
            el.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              this.contentEditable = 'true';
              this.focus();
            });
            el.addEventListener('blur', function() {
              this.contentEditable = 'false';
              // Notify parent of change
              window.parent.postMessage({ type: 'sf-content-changed' }, '*');
            });
          });

          // Image replacement on click
          document.querySelectorAll('[data-editable="image"]').forEach(function(el) {
            el.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              var input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = function(ev) {
                var file = ev.target.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function(re) {
                  var dataUrl = re.target.result;
                  if (el.tagName === 'IMG') {
                    el.src = dataUrl;
                  } else {
                    el.style.backgroundImage = 'url(' + dataUrl + ')';
                  }
                  window.parent.postMessage({ type: 'sf-content-changed' }, '*');
                };
                reader.readAsDataURL(file);
              };
              input.click();
            });
          });
        })();
      `;
      doc.body.appendChild(editScript);
    } else {
      // Remove edit mode
      const doc2 = iframeRef.current.contentDocument;
      if (doc2) {
        const style = doc2.getElementById("sf-edit-styles");
        if (style) style.remove();
        const badge = doc2.querySelector(".sf-edit-badge");
        if (badge) badge.remove();
        doc2.querySelectorAll("[contenteditable]").forEach((el) => {
          el.removeAttribute("contenteditable");
        });
      }
    }
  }, [editMode, site]);

  // Listen for content changes from iframe
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "sf-content-changed") {
        // Save the current iframe HTML
        saveCurrentState();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [site]);

  function saveCurrentState() {
    if (!iframeRef.current || !site) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    // Remove edit artifacts before saving
    const editStyle = doc.getElementById("sf-edit-styles");
    const badge = doc.querySelector(".sf-edit-badge");
    editStyle?.remove();
    badge?.remove();
    doc.querySelectorAll("[contenteditable]").forEach((el) => el.removeAttribute("contenteditable"));

    const newHtml = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
    const updated = { ...site, html: newHtml };
    setSite(updated);

    // Persist
    const sites: HtmlSite[] = JSON.parse(localStorage.getItem("siteforge_html_sites") || "[]");
    const idx = sites.findIndex((s) => s.id === site.id);
    if (idx !== -1) {
      sites[idx] = updated;
      localStorage.setItem("siteforge_html_sites", JSON.stringify(sites));
    }
  }

  function handleSave() {
    setSaving(true);
    saveCurrentState();
    setTimeout(() => setSaving(false), 1000);
  }

  function handleExport() {
    if (!site) return;
    saveCurrentState();
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
    if (!window.confirm("Supprimer ce site ?")) return;
    const sites: HtmlSite[] = JSON.parse(localStorage.getItem("siteforge_html_sites") || "[]");
    localStorage.setItem("siteforge_html_sites", JSON.stringify(sites.filter((s) => s.id !== siteId)));
    router.push("/dashboard");
  }

  async function handleChatSend() {
    if (!chatInput.trim() || chatLoading || !site) return;
    if (!hasCredits("regenerate")) { setShowBuyModal(true); return; }

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
        const updated = { ...site, html: result.html };
        setSite(updated);
        writeToIframe(result.html);

        const sites: HtmlSite[] = JSON.parse(localStorage.getItem("siteforge_html_sites") || "[]");
        const idx = sites.findIndex((s) => s.id === siteId);
        if (idx !== -1) { sites[idx] = updated; localStorage.setItem("siteforge_html_sites", JSON.stringify(sites)); }

        setChatMessages((prev) => [...prev, { role: "assistant", content: result.message || "✓ Modifié" }]);
      } else {
        setChatMessages((prev) => [...prev, { role: "assistant", content: `Erreur: ${result.error}` }]);
      }
    } catch {
      setChatMessages((prev) => [...prev, { role: "assistant", content: "Erreur de connexion" }]);
    } finally { setChatLoading(false); }
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
      <header className="flex items-center justify-between px-3 sm:px-5 py-2.5 border-b border-[var(--sf-app-border)] bg-[var(--sf-app-bg)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--sf-app-accent)] flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">SF</span>
            </div>
          </Link>
          <span className="text-sm font-medium truncate max-w-[150px]">{site.name}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <CreditBadge onClickBuy={() => setShowBuyModal(true)} />

          {/* Edit mode toggle */}
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              editMode
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-[var(--sf-app-surface)] text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)]"
            }`}
          >
            ✏️ {editMode ? "Édition ON" : "Éditer"}
          </button>

          {/* AI chat toggle */}
          <button
            onClick={() => setShowChat(!showChat)}
            className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              showChat
                ? "bg-[var(--sf-app-accent)] text-white"
                : "bg-[var(--sf-app-surface)] text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)]"
            }`}
          >
            ✨ IA
          </button>

          {/* Save */}
          <button onClick={handleSave} className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-[var(--sf-app-surface)] text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] transition-colors cursor-pointer">
            {saving ? "✓ Sauvé" : "💾"}
          </button>

          {/* Export */}
          <button onClick={handleExport} className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-[var(--sf-app-surface)] text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] transition-colors cursor-pointer">
            📥 Export
          </button>

          {/* Delete */}
          <button onClick={handleDelete} className="px-2 py-1.5 text-[11px] rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
            🗑
          </button>

          <Link href="/dashboard" className="px-2 py-1.5 text-[11px] text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)]">
            ← Retour
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Iframe */}
        <div className="flex-1 relative">
          <iframe
            ref={iframeRef}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms"
            title={site.name}
          />
        </div>

        {/* AI Chat panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 border-l border-[var(--sf-app-border)] flex flex-col bg-[var(--sf-app-bg)] overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-[var(--sf-app-border)]">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  ✨ Modifier avec l&apos;IA
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--sf-app-accent)]/10 text-[var(--sf-app-accent)]">3 crédits</span>
                </h3>
              </div>

              {/* Suggestions */}
              {chatMessages.length === 0 && (
                <div className="px-4 py-3 space-y-1.5 border-b border-[var(--sf-app-border)]">
                  {["Change les couleurs", "Modifie le titre", "Ajoute une section", "Change les images", "Traduis en anglais", "Rends le design plus moderne"].map((s, i) => (
                    <button key={i} onClick={() => setChatInput(s)} className="block w-full text-left text-[11px] px-3 py-2 rounded-lg bg-[var(--sf-app-surface)] text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] transition-colors cursor-pointer">{s}</button>
                  ))}
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${msg.role === "user" ? "bg-[var(--sf-app-accent)] text-white" : "bg-[var(--sf-app-surface)] text-[var(--sf-app-text)]"}`}>
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
                  type="text" value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleChatSend(); }}
                  placeholder="Décrivez votre modification..."
                  disabled={chatLoading}
                  className="flex-1 bg-[var(--sf-app-surface)] border border-[var(--sf-app-border)] rounded-lg px-3 py-2 text-xs outline-none focus:border-[var(--sf-app-accent)]/50 disabled:opacity-50"
                />
                <button onClick={handleChatSend} disabled={chatLoading || !chatInput.trim()} className="px-3 py-2 rounded-lg bg-[var(--sf-app-accent)] text-white disabled:opacity-30 cursor-pointer text-xs font-medium">
                  Envoyer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BuyCreditsModal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} />
    </div>
  );
}
