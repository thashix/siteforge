"use client";

import { useState } from "react";
import type { ContactContent } from "@/types";
import type { SectionProps } from "../types";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function ContactSection({ content, sectionId }: SectionProps<ContactContent>) {
  return (
    <section id={sectionId} className="py-20 sm:py-28" style={{ backgroundColor: "var(--sf-surface)" }}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <ScrollReveal>
          <h2 className="text-center text-[clamp(1.8rem,4vw,2.8rem)] leading-tight tracking-[-0.02em] mb-4" style={{ fontFamily: "var(--sf-font-heading)", fontWeight: "var(--sf-font-heading-weight)" as string, color: "var(--sf-text)" }}>
            {content.title}
          </h2>
        </ScrollReveal>
        {content.subtitle && (
          <ScrollReveal delay={0.1}>
            <p className="text-center text-base max-w-lg mx-auto mb-4" style={{ color: "var(--sf-text-muted)", fontWeight: 300 }}>{content.subtitle}</p>
          </ScrollReveal>
        )}
        <ScrollReveal delay={0.15}><div className="w-12 h-px mx-auto mb-14" style={{ backgroundColor: "var(--sf-primary)" }} /></ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
          {/* Contact info */}
          <ScrollReveal delay={0.2}>
            <div className="space-y-7">
              {content.email && (
                <ContactItem icon="mail" label="Email" value={content.email} href={`mailto:${content.email}`} />
              )}
              {content.phone && (
                <ContactItem icon="phone" label="Téléphone" value={content.phone} href={`tel:${content.phone.replace(/\s/g, "")}`} />
              )}
              {content.address && (
                <ContactItem icon="pin" label="Adresse" value={content.address} />
              )}
              <ContactItem icon="clock" label="Horaires" value="Lun-Ven : 9h-18h" />
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal delay={0.3}>
            <ContactForm email={content.email} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon, label, value, href }: { icon: string; label: string; value: string; href?: string }) {
  const icons: Record<string, React.ReactNode> = {
    mail: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>,
    phone: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
    pin: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
    clock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  };

  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper {...(href ? { href } : {})} className="flex items-start gap-4 group">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
        style={{ backgroundColor: "color-mix(in srgb, var(--sf-primary) 10%, transparent)", color: "var(--sf-primary)" }}>
        {icons[icon]}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.15em] mb-1" style={{ color: "var(--sf-text-muted)", fontFamily: "var(--sf-font-body)" }}>{label}</p>
        <p className="text-sm whitespace-pre-line" style={{ color: "var(--sf-text)", fontFamily: "var(--sf-font-body)" }}>{value}</p>
      </div>
    </Wrapper>
  );
}

function ContactForm({ email }: { email?: string }) {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const to = email || "contact@example.com";
    const subject = encodeURIComponent(formData.subject || "Contact depuis le site");
    const body = encodeURIComponent(`Nom: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  const inputStyle = {
    backgroundColor: "var(--sf-background)",
    borderColor: "var(--sf-border)",
    color: "var(--sf-text)",
    fontFamily: "var(--sf-font-body)",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text" placeholder="Votre nom" required value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 text-sm rounded-lg border outline-none transition-colors duration-200 focus:border-[var(--sf-primary)]"
          style={inputStyle}
        />
        <input
          type="email" placeholder="Votre email" required value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 text-sm rounded-lg border outline-none transition-colors duration-200 focus:border-[var(--sf-primary)]"
          style={inputStyle}
        />
      </div>
      <input
        type="text" placeholder="Sujet" value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        className="w-full px-4 py-3 text-sm rounded-lg border outline-none transition-colors duration-200 focus:border-[var(--sf-primary)]"
        style={inputStyle}
      />
      <textarea
        placeholder="Votre message" required rows={5} value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="w-full px-4 py-3 text-sm rounded-lg border outline-none transition-colors duration-200 resize-none focus:border-[var(--sf-primary)]"
        style={inputStyle}
      />
      <button
        type="submit"
        className="w-full py-3.5 text-[12px] font-bold tracking-[0.08em] uppercase rounded-lg transition-all duration-300 cursor-pointer hover:-translate-y-[1px]"
        style={{
          backgroundColor: "var(--sf-primary)",
          color: "var(--sf-background)",
          fontFamily: "var(--sf-font-body)",
        }}
      >
        {sent ? "✓ Message préparé" : "Envoyer le message"}
      </button>
    </form>
  );
}
