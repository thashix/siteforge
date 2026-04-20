"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FaqContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionWrapper } from "@/components/ui/section-wrapper";

// =============================================================================
// FAQ SECTION
// =============================================================================
// Single variant: clean accordion with animated expand/collapse
// =============================================================================

export function FaqSection({
  content,
  animation,
  sectionId,
}: SectionProps<FaqContent>) {
  return (
    <SectionWrapper id={sectionId} background="default">
      <ScrollReveal config={animation}>
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-[var(--sf-font-heading-weight)] tracking-tight"
            style={{ fontFamily: "var(--sf-font-heading)", color: "var(--sf-text)" }}
          >
            {content.title}
          </h2>
        </div>
      </ScrollReveal>

      <div className="max-w-3xl mx-auto space-y-3">
        {content.items.map((item, i) => (
          <ScrollReveal key={i} config={animation} index={i + 1}>
            <FaqItem question={item.question} answer={item.answer} />
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--sf-border)",
        backgroundColor: "var(--sf-surface)",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-6 py-5 text-left transition-colors duration-150 cursor-pointer"
      >
        <span
          className="text-base font-medium pr-4"
          style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text)" }}
        >
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-xl"
          style={{ color: "var(--sf-primary)" }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="px-6 pb-5">
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: "var(--sf-font-body)", color: "var(--sf-text-muted)" }}
              >
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
