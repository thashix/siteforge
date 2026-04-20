"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SectionConfig, SectionContent } from "@/types";

// =============================================================================
// SECTION EDITOR PANEL
// =============================================================================
// Slide-in panel from the right. Shows editable fields for the selected
// section's content. Generic: reads the content object and renders
// text inputs for string fields, textarea for long fields.
// =============================================================================

interface SectionEditorProps {
  section: SectionConfig | null;
  onClose: () => void;
  onSave: (sectionId: string, content: SectionContent) => void;
}

export function SectionEditorPanel({
  section,
  onClose,
  onSave,
}: SectionEditorProps) {
  const [editedContent, setEditedContent] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (section) {
      setEditedContent({ ...section.content } as Record<string, unknown>);
    }
  }, [section]);

  if (!section) return null;

  function handleFieldChange(key: string, value: unknown) {
    setEditedContent((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    onSave(section!.id, editedContent as unknown as SectionContent);
    onClose();
  }

  // Get editable fields (skip 'type' and complex nested objects for MVP)
  const editableFields = Object.entries(editedContent).filter(
    ([key, value]) =>
      key !== "type" && (typeof value === "string" || Array.isArray(value))
  );

  return (
    <AnimatePresence>
      {section && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full sm:w-[420px] bg-[var(--sf-app-bg)] border-l border-[var(--sf-app-border)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--sf-app-border)]">
              <div>
                <h2 className="font-semibold text-sm">
                  Modifier : {section.type}
                </h2>
                <p className="text-xs text-[var(--sf-app-text-muted)] mt-0.5">
                  Variante : {section.variant}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[var(--sf-app-surface)] transition-colors cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Content fields */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {editableFields.map(([key, value]) => {
                if (typeof value === "string") {
                  const isLong = value.length > 80 || key === "text" || key === "subheadline" || key === "subtitle";
                  return (
                    <FieldEditor
                      key={key}
                      label={formatLabel(key)}
                      value={value}
                      multiline={isLong}
                      onChange={(v) => handleFieldChange(key, v)}
                    />
                  );
                }

                if (Array.isArray(value)) {
                  return (
                    <ArrayFieldEditor
                      key={key}
                      label={formatLabel(key)}
                      fieldKey={key}
                      items={value}
                      sectionType={section.type}
                      onChange={(items) => handleFieldChange(key, items)}
                    />
                  );
                }

                return null;
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 px-5 py-4 border-t border-[var(--sf-app-border)]">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg border border-[var(--sf-app-border)] text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg bg-[var(--sf-app-accent)] text-white hover:bg-[var(--sf-app-accent-hover)] transition-colors cursor-pointer"
              >
                Enregistrer
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// -- Field Editor -------------------------------------------------------------

function FieldEditor({
  label,
  value,
  multiline,
  onChange,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  onChange: (value: string) => void;
}) {
  const inputClasses = `
    w-full px-3 py-2.5 text-sm rounded-lg
    bg-[var(--sf-app-surface)]
    border border-[var(--sf-app-border)]
    text-[var(--sf-app-text)]
    focus:outline-none focus:ring-1 focus:ring-[var(--sf-app-accent)]
    transition-all duration-150
  `;

  return (
    <div>
      <label className="block text-xs font-medium text-[var(--sf-app-text-muted)] mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={`${inputClasses} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
        />
      )}
    </div>
  );
}

// -- Array Field Editor --------------------------------------------------------

function ArrayFieldEditor({
  label,
  fieldKey,
  items,
  sectionType,
  onChange,
}: {
  label: string;
  fieldKey: string;
  items: unknown[];
  sectionType: string;
  onChange: (items: unknown[]) => void;
}) {
  // Gallery images — show image upload
  if (fieldKey === "images" && sectionType === "gallery") {
    return (
      <GalleryImagesEditor
        label={label}
        images={items as Array<{ alt: string; placeholder: string; src?: string }>}
        onChange={onChange}
      />
    );
  }

  // Generic array items (services, testimonials, faq, etc.)
  return (
    <GenericArrayEditor
      label={label}
      items={items as Array<Record<string, unknown>>}
      onChange={onChange}
    />
  );
}

// -- Gallery Images Editor ----------------------------------------------------

function GalleryImagesEditor({
  label,
  images,
  onChange,
}: {
  label: string;
  images: Array<{ alt: string; placeholder: string; src?: string }>;
  onChange: (images: unknown[]) => void;
}) {
  function handleImageUpload(index: number, file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      // Resize via canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;
        if (w > 800) { h = Math.round((h * 800) / w); w = 800; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

        const updated = [...images];
        updated[index] = { ...updated[index], src: dataUrl };
        onChange(updated);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  function handleAddImage() {
    onChange([...images, { alt: `Image ${images.length + 1}`, placeholder: "gradient" }]);
  }

  function handleRemoveImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function handleAltChange(index: number, alt: string) {
    const updated = [...images];
    updated[index] = { ...updated[index], alt };
    onChange(updated);
  }

  return (
    <div>
      <label className="block text-xs font-medium text-[var(--sf-app-text-muted)] mb-2">
        {label} ({images.length})
      </label>
      <div className="space-y-2">
        {images.map((img, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 rounded-lg bg-[var(--sf-app-surface)] border border-[var(--sf-app-border)]"
          >
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
              {img.src ? (
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(135deg, var(--sf-app-accent), var(--sf-app-surface))`,
                    opacity: 0.5,
                  }}
                />
              )}
            </div>

            {/* Alt text */}
            <input
              type="text"
              value={img.alt}
              onChange={(e) => handleAltChange(i, e.target.value)}
              placeholder="Description..."
              className="flex-1 text-xs bg-transparent border-none outline-none text-[var(--sf-app-text)]"
            />

            {/* Upload button */}
            <label className="px-2 py-1 text-[10px] rounded bg-[var(--sf-app-accent)]/10 text-[var(--sf-app-accent)] cursor-pointer hover:bg-[var(--sf-app-accent)]/20 transition-colors">
              📷
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(i, file);
                  e.target.value = "";
                }}
              />
            </label>

            {/* Remove */}
            <button
              onClick={() => handleRemoveImage(i)}
              className="p-1 text-[var(--sf-app-text-muted)] hover:text-red-400 transition-colors cursor-pointer"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddImage}
        className="mt-2 w-full py-2 text-xs rounded-lg border border-dashed border-[var(--sf-app-border)] text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] hover:border-[var(--sf-app-accent)]/30 transition-colors cursor-pointer"
      >
        + Ajouter une image
      </button>
    </div>
  );
}

// -- Generic Array Editor (services, testimonials, faq items) -----------------

function GenericArrayEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: Array<Record<string, unknown>>;
  onChange: (items: unknown[]) => void;
}) {
  function handleItemFieldChange(index: number, field: string, value: string) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  function handleRemoveItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  // Get string field names from the first item
  const stringFields = items.length > 0
    ? Object.entries(items[0])
        .filter(([, v]) => typeof v === "string")
        .map(([k]) => k)
    : [];

  return (
    <div>
      <label className="block text-xs font-medium text-[var(--sf-app-text-muted)] mb-2">
        {label} ({items.length} éléments)
      </label>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="p-3 rounded-lg bg-[var(--sf-app-surface)] border border-[var(--sf-app-border)] space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[var(--sf-app-text-muted)] font-medium">
                #{i + 1}
              </span>
              <button
                onClick={() => handleRemoveItem(i)}
                className="text-xs text-[var(--sf-app-text-muted)] hover:text-red-400 transition-colors cursor-pointer"
              >
                Supprimer
              </button>
            </div>
            {stringFields.map((field) => (
              <div key={field}>
                <label className="block text-[10px] text-[var(--sf-app-text-muted)] mb-0.5 capitalize">
                  {formatLabel(field)}
                </label>
                {String(item[field] || "").length > 60 ? (
                  <textarea
                    value={String(item[field] || "")}
                    onChange={(e) => handleItemFieldChange(i, field, e.target.value)}
                    rows={2}
                    className="w-full text-xs px-2 py-1.5 rounded bg-[var(--sf-app-bg)] border border-[var(--sf-app-border)] text-[var(--sf-app-text)] outline-none resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={String(item[field] || "")}
                    onChange={(e) => handleItemFieldChange(i, field, e.target.value)}
                    className="w-full text-xs px-2 py-1.5 rounded bg-[var(--sf-app-bg)] border border-[var(--sf-app-border)] text-[var(--sf-app-text)] outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// -- Helpers ------------------------------------------------------------------

function formatLabel(key: string): string {
  const labels: Record<string, string> = {
    headline: "Titre principal",
    subheadline: "Sous-titre",
    ctaText: "Texte du bouton",
    ctaLink: "Lien du bouton",
    title: "Titre",
    subtitle: "Sous-titre",
    text: "Texte",
    buttonText: "Texte du bouton",
    buttonLink: "Lien du bouton",
    email: "Email",
    phone: "Téléphone",
    address: "Adresse",
    businessName: "Nom de l'entreprise",
    tagline: "Slogan",
    copyright: "Copyright",
    items: "Éléments",
    plans: "Formules",
    images: "Images",
    highlights: "Points forts",
    links: "Liens",
  };
  return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

// -- Icons --------------------------------------------------------------------

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18" /><path d="M6 6l12 12" />
    </svg>
  );
}
