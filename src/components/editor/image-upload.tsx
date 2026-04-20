"use client";

import { useRef, useState } from "react";
import { fileToDataUrl, type StoredImage } from "@/lib/image-storage";

// =============================================================================
// IMAGE UPLOAD BUTTON
// =============================================================================
// Click to open file picker, processes the image (resize + compress),
// and calls onUpload with the StoredImage result.
// =============================================================================

interface ImageUploadButtonProps {
  onUpload: (image: StoredImage) => void;
  className?: string;
  children?: React.ReactNode;
}

export function ImageUploadButton({
  onUpload,
  className,
  children,
}: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const image = await fileToDataUrl(file);
      onUpload(image);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={className || `
          px-3 py-1.5 text-xs font-medium rounded-lg
          border border-dashed border-white/20
          text-white/50 hover:text-white/80 hover:border-white/40
          transition-colors cursor-pointer
        `}
      >
        {uploading ? "Chargement..." : children || "📷 Ajouter une image"}
      </button>
    </>
  );
}

// -- Multi-image upload -------------------------------------------------------

interface MultiImageUploadProps {
  onUpload: (image: StoredImage) => void;
  className?: string;
}

export function MultiImageUpload({ onUpload, className }: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const image = await fileToDataUrl(files[i]);
        onUpload(image);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={className || `
          flex flex-col items-center justify-center
          w-full min-h-[120px] rounded-xl
          border-2 border-dashed border-white/10
          hover:border-[var(--sf-app-accent)]/30
          text-white/30 hover:text-white/60
          transition-all cursor-pointer
        `}
      >
        {uploading ? (
          <span className="text-sm">Chargement...</span>
        ) : (
          <>
            <CameraIcon />
            <span className="text-xs mt-2">Cliquer pour ajouter des images</span>
          </>
        )}
      </button>
    </>
  );
}

function CameraIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <circle cx="12" cy="13" r="4" />
      <path d="M2 6l3-3h5l2 3" />
    </svg>
  );
}
