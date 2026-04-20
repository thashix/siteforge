"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// =============================================================================
// TOAST SYSTEM
// =============================================================================
// Simple toast notifications for user feedback.
// Usage: const { toast, ToastContainer } = useToast();
//        toast("Site sauvegardé !", "success");
// =============================================================================

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const ToastContainer = useCallback(
    () => (
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`
                px-4 py-3 rounded-xl text-sm font-medium shadow-lg
                backdrop-blur-md border max-w-[320px]
                ${
                  t.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                    : t.type === "error"
                    ? "bg-red-500/10 border-red-500/20 text-red-300"
                    : "bg-[var(--sf-app-surface)] border-[var(--sf-app-border)] text-[var(--sf-app-text)]"
                }
              `}
            >
              <span className="mr-2">
                {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
              </span>
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    ),
    [toasts]
  );

  return { toast, ToastContainer };
}
