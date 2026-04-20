"use client";

import { motion } from "framer-motion";
import type { SectionConfig, SectionType } from "@/types";
import { SECTION_VARIANTS } from "@/sections/registry";

// =============================================================================
// SECTION OVERLAY
// =============================================================================
// Floating toolbar shown on hover over each section in edit mode.
// Controls: move up, move down, change variant, edit content, delete.
// =============================================================================

interface SectionOverlayProps {
  section: SectionConfig;
  index: number;
  total: number;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onChangeVariant: (variant: string) => void;
  onAIChat?: () => void;
}

export function SectionOverlay({
  section,
  index,
  total,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onRemove,
  onChangeVariant,
  onAIChat,
}: SectionOverlayProps) {
  const variants = SECTION_VARIANTS[section.type] || [];
  const hasMultipleVariants = variants.length > 1;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <div className="group relative">
      {/* Highlight border on hover */}
      <div
        className={`
          absolute inset-0 z-40 pointer-events-none transition-all duration-200
          ${isSelected ? "ring-2 ring-[var(--sf-app-accent)] ring-inset" : "group-hover:ring-2 group-hover:ring-[var(--sf-app-accent)]/40 group-hover:ring-inset"}
        `}
      />

      {/* Floating toolbar — appears on hover */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          absolute top-3 right-3 z-50
          flex items-center gap-1.5
          px-2 py-1.5 rounded-lg
          bg-[#18181B]/90 backdrop-blur-md border border-white/10
          shadow-xl
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          ${isSelected ? "!opacity-100" : ""}
        `}
      >
        {/* Section type label */}
        <span className="text-[10px] font-medium text-white/60 uppercase tracking-wider px-1">
          {section.type}
        </span>

        <div className="w-px h-4 bg-white/10" />

        {/* Move up */}
        <ToolbarButton
          onClick={onMoveUp}
          disabled={isFirst}
          title="Monter"
        >
          <ChevronUpIcon />
        </ToolbarButton>

        {/* Move down */}
        <ToolbarButton
          onClick={onMoveDown}
          disabled={isLast}
          title="Descendre"
        >
          <ChevronDownIcon />
        </ToolbarButton>

        {/* Variant switcher */}
        {hasMultipleVariants && (
          <>
            <div className="w-px h-4 bg-white/10" />
            <select
              value={section.variant}
              onChange={(e) => onChangeVariant(e.target.value)}
              title="Changer la variante"
              className="text-[10px] bg-transparent text-white/80 border-none outline-none cursor-pointer px-1"
            >
              {variants.map((v) => (
                <option key={v} value={v} className="bg-[#18181B] text-white">
                  {v}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="w-px h-4 bg-white/10" />

        {/* AI modify */}
        {onAIChat && (
          <ToolbarButton onClick={onAIChat} title="Modifier avec l'IA ✨">
            <SparkleIcon />
          </ToolbarButton>
        )}

        {/* Edit content */}
        <ToolbarButton onClick={onSelect} title="Modifier le contenu">
          <EditIcon />
        </ToolbarButton>

        {/* Delete */}
        <ToolbarButton
          onClick={onRemove}
          title="Supprimer"
          variant="danger"
        >
          <TrashIcon />
        </ToolbarButton>
      </motion.div>
    </div>
  );
}

// -- Toolbar Button -----------------------------------------------------------

function ToolbarButton({
  children,
  onClick,
  disabled,
  title,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
  variant?: "default" | "danger";
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={`
        p-1.5 rounded-md transition-colors cursor-pointer
        ${disabled ? "opacity-30 cursor-not-allowed" : ""}
        ${
          variant === "danger"
            ? "hover:bg-red-500/20 text-red-400"
            : "hover:bg-white/10 text-white/70 hover:text-white"
        }
      `}
    >
      {children}
    </button>
  );
}

// -- Icons --------------------------------------------------------------------

function ChevronUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" />
    </svg>
  );
}
