"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FaqContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function FaqSection({ content, sectionId }: SectionProps<FaqContent>) {
  return (
    <section id={sectionId} className="py-20 sm:py-28" style={{ backgroundColor: "var(--sf-surface)" }}>
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <ScrollReveal>
          <h2 className="text-center text-[clamp(1.8rem,4vw,2.8rem)] leading-tight tracking-[-0.02em] mb-4" style={{ fontFamily: "var(--sf-font-heading)", fontWeight: "var(--sf-font-heading-weight)" as string, color: "var(--sf-text)" }}>
            {content.title}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}><div className="w-12 h-px mx-auto mb-14" style={{ backgroundColor: "var(--sf-primary)" }} /></ScrollReveal>

        <div className="space-y-3">
          {content.items.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.06}>
              <FaqItem question={item.question} answer={item.answer} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-lg border overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: "var(--sf-background)",
        borderColor: open ? "color-mix(in srgb, var(--sf-primary) 30%, transparent)" : "var(--sf-border)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer"
        style={{ fontFamily: "var(--sf-font-body)" }}
      >
        <span className="text-sm sm:text-base pr-4" style={{ color: "var(--sf-text)" }}>{question}</span>
        <span
          className="text-xl flex-shrink-0 transition-transform duration-300"
          style={{ color: "var(--sf-primary)", transform: open ? "rotate(45deg)" : "rotate(0)" }}
        >
          +
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6">
              <p className="text-sm leading-[1.8]" style={{ color: "var(--sf-text-muted)", fontWeight: 300, fontFamily: "var(--sf-font-body)" }}>
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
