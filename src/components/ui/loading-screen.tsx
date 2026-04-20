"use client";

import { motion } from "framer-motion";

// =============================================================================
// Loading Screen
// =============================================================================
// Full-page centered loading animation for generation flow and page loads.
// =============================================================================

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--sf-app-bg)]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-2 border-[var(--sf-app-accent)] border-t-transparent rounded-full mb-4"
      />
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-[var(--sf-app-text-muted)]"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
