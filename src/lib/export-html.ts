import type { SiteConfig, ThemeConfig, SectionConfig, SectionContent } from "@/types";
import type {
  HeroContent,
  ServicesContent,
  AboutContent,
  GalleryContent,
  TestimonialsContent,
  CtaContent,
  PricingContent,
  FaqContent,
  ContactContent,
  FooterContent,
} from "@/types";

// =============================================================================
// STATIC HTML EXPORTER
// =============================================================================
// Generates a fully standalone HTML file from a SiteConfig.
// The output is a single .html file that works anywhere — no server needed.
//
// Includes:
// - Google Fonts <link>
// - All CSS (theme variables + component styles) inline
// - Scroll reveal animations via IntersectionObserver (no JS framework)
// - Responsive design
// - Accessible markup
// =============================================================================

/** Font name extraction from CSS font-family string */
function extractFontName(cssFontFamily: string): string {
  return cssFontFamily.replace(/^'|'$/g, "").split("',")[0].trim();
}

function googleFontUrl(theme: ThemeConfig): string {
  const heading = extractFontName(theme.fonts.heading).replace(/ /g, "+");
  const body = extractFontName(theme.fonts.body).replace(/ /g, "+");
  const families = [heading, body].filter((v, i, a) => a.indexOf(v) === i);
  return `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}:wght@300;400;500;600;700`).join("&")}&display=swap`;
}

function themeCSS(theme: ThemeConfig): string {
  const { colors, fonts, borderRadius } = theme;
  const radiusMap: Record<string, string> = { none: "0px", sm: "4px", md: "8px", lg: "16px", full: "9999px" };

  return `
    --sf-primary: ${colors.primary};
    --sf-secondary: ${colors.secondary};
    --sf-background: ${colors.background};
    --sf-surface: ${colors.surface};
    --sf-text: ${colors.text};
    --sf-text-muted: ${colors.textMuted};
    --sf-accent: ${colors.accent};
    --sf-border: ${colors.border};
    --sf-font-heading: ${fonts.heading};
    --sf-font-body: ${fonts.body};
    --sf-font-heading-weight: ${fonts.headingWeight};
    --sf-font-body-weight: ${fonts.bodyWeight};
    --sf-radius: ${radiusMap[borderRadius] || "8px"};
  `;
}

// -- Section Renderers (HTML strings) -----------------------------------------

function renderHeroHTML(c: HeroContent, variant: string): string {
  if (variant === "split") {
    return `
    <section class="sf-hero-split">
      <div class="sf-container sf-hero-split-grid">
        <div class="sf-reveal">
          <h1 class="sf-h1">${esc(c.headline)}</h1>
          <p class="sf-subtitle">${esc(c.subheadline)}</p>
          <a href="${esc(c.ctaLink || "#contact")}" class="sf-btn">${esc(c.ctaText)}</a>
        </div>
        <div class="sf-hero-visual sf-reveal">
          <div class="sf-hero-gradient"></div>
        </div>
      </div>
    </section>`;
  }
  return `
  <section class="sf-hero">
    <div class="sf-hero-bg"></div>
    <div class="sf-container sf-hero-center">
      <h1 class="sf-h1 sf-reveal">${esc(c.headline)}</h1>
      <p class="sf-subtitle sf-reveal">${esc(c.subheadline)}</p>
      <a href="${esc(c.ctaLink || "#contact")}" class="sf-btn sf-reveal">${esc(c.ctaText)}</a>
    </div>
  </section>`;
}

function renderServicesHTML(c: ServicesContent): string {
  const items = c.items.map((item, i) => `
    <div class="sf-card sf-reveal" style="animation-delay:${i * 0.08}s">
      ${item.icon ? `<div class="sf-card-icon">${item.icon}</div>` : ""}
      <h3 class="sf-h3">${esc(item.title)}</h3>
      <p class="sf-text-muted">${esc(item.description)}</p>
    </div>`).join("");

  return `
  <section class="sf-section sf-bg-surface" id="services">
    <div class="sf-container">
      <h2 class="sf-h2 sf-text-center sf-reveal">${esc(c.title)}</h2>
      ${c.subtitle ? `<p class="sf-subtitle sf-text-center sf-reveal">${esc(c.subtitle)}</p>` : ""}
      <div class="sf-grid-3">${items}</div>
    </div>
  </section>`;
}

function renderAboutHTML(c: AboutContent): string {
  const highlights = c.highlights?.map((h, i) => `
    <div class="sf-highlight sf-reveal" style="animation-delay:${i * 0.08}s">
      <div class="sf-highlight-num">${i + 1}</div>
      <p>${esc(h)}</p>
    </div>`).join("") || "";

  return `
  <section class="sf-section" id="about">
    <div class="sf-container sf-grid-2">
      <div class="sf-reveal">
        <h2 class="sf-h2">${esc(c.title)}</h2>
        <p class="sf-text-muted sf-text-lg">${esc(c.text)}</p>
      </div>
      ${highlights ? `<div class="sf-highlights-grid">${highlights}</div>` : ""}
    </div>
  </section>`;
}

function renderGalleryHTML(c: GalleryContent): string {
  const images = c.images.map((img, i) => {
    const innerContent = img.src
      ? `<img src="${esc(img.src)}" alt="${esc(img.alt)}" class="sf-gallery-img" loading="lazy">`
      : `<div class="sf-gallery-gradient" style="background:linear-gradient(${135 + i * 30}deg, var(--sf-primary), var(--sf-secondary))"></div>`;

    return `
    <div class="sf-gallery-item sf-reveal" style="animation-delay:${i * 0.06}s" title="${esc(img.alt)}">
      ${innerContent}
    </div>`;
  }).join("");

  return `
  <section class="sf-section" id="gallery">
    <div class="sf-container">
      <h2 class="sf-h2 sf-text-center sf-reveal">${esc(c.title)}</h2>
      ${c.subtitle ? `<p class="sf-subtitle sf-text-center sf-reveal">${esc(c.subtitle)}</p>` : ""}
      <div class="sf-gallery-grid">${images}</div>
    </div>
  </section>`;
}

function renderTestimonialsHTML(c: TestimonialsContent): string {
  const items = c.items.map((t, i) => `
    <div class="sf-testimonial-card sf-reveal" style="animation-delay:${i * 0.1}s">
      <div class="sf-quote-mark">&ldquo;</div>
      <p class="sf-quote-text">${esc(t.quote)}</p>
      <div class="sf-quote-author">
        <div class="sf-avatar">${t.author.charAt(0)}</div>
        <div>
          <p class="sf-author-name">${esc(t.author)}</p>
          ${t.role ? `<p class="sf-text-muted sf-text-sm">${esc(t.role)}</p>` : ""}
        </div>
      </div>
    </div>`).join("");

  return `
  <section class="sf-section sf-bg-surface" id="testimonials">
    <div class="sf-container">
      <h2 class="sf-h2 sf-text-center sf-reveal">${esc(c.title)}</h2>
      <div class="sf-grid-3">${items}</div>
    </div>
  </section>`;
}

function renderCtaHTML(c: CtaContent): string {
  return `
  <section class="sf-cta">
    <div class="sf-cta-bg"></div>
    <div class="sf-container sf-text-center sf-reveal">
      <h2 class="sf-cta-h2">${esc(c.headline)}</h2>
      ${c.subheadline ? `<p class="sf-cta-sub">${esc(c.subheadline)}</p>` : ""}
      <a href="${esc(c.buttonLink || "#contact")}" class="sf-btn sf-btn-inverse">${esc(c.buttonText)}</a>
    </div>
  </section>`;
}

function renderPricingHTML(c: PricingContent): string {
  const plans = c.plans.map((p, i) => `
    <div class="sf-pricing-card ${p.highlighted ? "sf-pricing-highlighted" : ""} sf-reveal" style="animation-delay:${i * 0.1}s">
      ${p.highlighted ? '<div class="sf-pricing-badge">Populaire</div>' : ""}
      <h3 class="sf-h3">${esc(p.name)}</h3>
      <p class="sf-pricing-price">${esc(p.price)}</p>
      <ul class="sf-pricing-features">${p.features.map((f) => `<li>✓ ${esc(f)}</li>`).join("")}</ul>
      <a href="#contact" class="sf-btn ${p.highlighted ? "sf-btn-inverse" : ""}">Choisir</a>
    </div>`).join("");

  return `
  <section class="sf-section sf-bg-surface" id="pricing">
    <div class="sf-container">
      <h2 class="sf-h2 sf-text-center sf-reveal">${esc(c.title)}</h2>
      ${c.subtitle ? `<p class="sf-subtitle sf-text-center sf-reveal">${esc(c.subtitle)}</p>` : ""}
      <div class="sf-grid-3 sf-pricing-grid">${plans}</div>
    </div>
  </section>`;
}

function renderFaqHTML(c: FaqContent): string {
  const items = c.items.map((faq, i) => `
    <details class="sf-faq-item sf-reveal" style="animation-delay:${i * 0.06}s">
      <summary class="sf-faq-q">${esc(faq.question)}</summary>
      <div class="sf-faq-a"><p>${esc(faq.answer)}</p></div>
    </details>`).join("");

  return `
  <section class="sf-section" id="faq">
    <div class="sf-container">
      <h2 class="sf-h2 sf-text-center sf-reveal">${esc(c.title)}</h2>
      <div class="sf-faq-list">${items}</div>
    </div>
  </section>`;
}

function renderContactHTML(c: ContactContent): string {
  return `
  <section class="sf-section sf-bg-surface" id="contact">
    <div class="sf-container">
      <h2 class="sf-h2 sf-text-center sf-reveal">${esc(c.title)}</h2>
      ${c.subtitle ? `<p class="sf-subtitle sf-text-center sf-reveal">${esc(c.subtitle)}</p>` : ""}
      <div class="sf-grid-2 sf-contact-grid">
        <div class="sf-reveal">
          ${c.email ? `<div class="sf-contact-info"><strong>Email</strong><p>${esc(c.email)}</p></div>` : ""}
          ${c.phone ? `<div class="sf-contact-info"><strong>Téléphone</strong><p>${esc(c.phone)}</p></div>` : ""}
          ${c.address ? `<div class="sf-contact-info"><strong>Adresse</strong><p>${esc(c.address)}</p></div>` : ""}
        </div>
        <form class="sf-form sf-reveal" onsubmit="event.preventDefault();alert('Merci ! (Formulaire de démo)')">
          <div class="sf-form-row"><input type="text" placeholder="Votre nom" class="sf-input"><input type="email" placeholder="Votre email" class="sf-input"></div>
          <input type="text" placeholder="Sujet" class="sf-input">
          <textarea rows="5" placeholder="Votre message" class="sf-input"></textarea>
          <button type="submit" class="sf-btn sf-btn-full">Envoyer le message</button>
        </form>
      </div>
    </div>
  </section>`;
}

function renderFooterHTML(c: FooterContent): string {
  const links = c.links?.map((l) => `<a href="${esc(l.href)}" class="sf-footer-link">${esc(l.label)}</a>`).join("") || "";
  return `
  <footer class="sf-footer">
    <div class="sf-container sf-footer-inner">
      <div>
        <h3 class="sf-footer-brand">${esc(c.businessName)}</h3>
        ${c.tagline ? `<p class="sf-text-muted sf-text-sm">${esc(c.tagline)}</p>` : ""}
      </div>
      ${links ? `<nav class="sf-footer-links">${links}</nav>` : ""}
    </div>
    ${c.copyright ? `<div class="sf-footer-copyright"><p>${esc(c.copyright)}</p></div>` : ""}
  </footer>`;
}

// -- Section router -----------------------------------------------------------

function renderSectionHTML(section: SectionConfig): string {
  const c = section.content;
  switch (section.type) {
    case "hero": return renderHeroHTML(c as HeroContent, section.variant);
    case "services": return renderServicesHTML(c as ServicesContent);
    case "about": return renderAboutHTML(c as AboutContent);
    case "gallery": return renderGalleryHTML(c as GalleryContent);
    case "testimonials": return renderTestimonialsHTML(c as TestimonialsContent);
    case "cta": return renderCtaHTML(c as CtaContent);
    case "pricing": return renderPricingHTML(c as PricingContent);
    case "faq": return renderFaqHTML(c as FaqContent);
    case "contact": return renderContactHTML(c as ContactContent);
    case "footer": return renderFooterHTML(c as FooterContent);
    default: return "";
  }
}

// -- Main export function -----------------------------------------------------

export function exportSiteToHTML(config: SiteConfig): string {
  const { theme, meta } = config;
  const fontUrl = googleFontUrl(theme);
  const cssVars = themeCSS(theme);

  const isMultiPage = config.pages && config.pages.length > 1;

  // Build page content
  let bodyContent: string;
  let navHTML = "";
  let pageScript = "";

  if (isMultiPage && config.pages) {
    // Multi-page: render each page in a div, JS toggles visibility
    const businessName = (() => {
      const allSections = config.pages!.flatMap((p) => p.sections);
      const footer = allSections.find((s) => s.type === "footer");
      if (footer && "businessName" in footer.content) return (footer.content as { businessName: string }).businessName;
      return meta.title.split("—")[0]?.trim() || "";
    })();

    navHTML = `
  <nav class="sf-site-nav">
    <div class="sf-container sf-site-nav-inner">
      <span class="sf-site-nav-brand" onclick="sfNav('${config.pages[0].id}')">${esc(businessName)}</span>
      <div class="sf-site-nav-links">
        ${config.pages.map((p) => `<button class="sf-site-nav-link${p.id === config.pages![0].id ? " sf-nav-active" : ""}" data-page="${p.id}" onclick="sfNav('${p.id}')">${esc(p.name)}</button>`).join("")}
      </div>
    </div>
  </nav>`;

    const pagesHTML = config.pages.map((page, i) => {
      const sectionsHTML = page.sections.map(renderSectionHTML).join("\n");
      return `<div class="sf-page" id="page-${page.id}" ${i > 0 ? 'style="display:none"' : ""}>${sectionsHTML}</div>`;
    }).join("\n");

    bodyContent = navHTML + "\n" + pagesHTML;

    pageScript = `
  function sfNav(pageId) {
    document.querySelectorAll('.sf-page').forEach(function(p) { p.style.display = 'none'; });
    var target = document.getElementById('page-' + pageId);
    if (target) target.style.display = 'block';
    document.querySelectorAll('.sf-site-nav-link').forEach(function(btn) {
      btn.classList.toggle('sf-nav-active', btn.getAttribute('data-page') === pageId);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Re-observe new page elements
    if (typeof sfInitReveal === 'function') sfInitReveal();
  }`;
  } else {
    // Single page (legacy)
    const sections = config.pages && config.pages.length === 1
      ? config.pages[0].sections
      : config.sections;
    bodyContent = sections.map(renderSectionHTML).join("\n");
  }

  const navCSS = isMultiPage ? `
    .sf-site-nav { position: sticky; top: 0; z-index: 40; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); background: color-mix(in srgb, var(--sf-background) 85%, transparent); border-bottom: 1px solid var(--sf-border); }
    .sf-site-nav-inner { display: flex; align-items: center; justify-content: space-between; height: 56px; }
    .sf-site-nav-brand { font-family: var(--sf-font-heading); font-weight: 600; font-size: 0.95rem; cursor: pointer; color: var(--sf-text); }
    .sf-site-nav-links { display: flex; gap: 4px; }
    .sf-site-nav-link { background: none; border: none; padding: 6px 14px; font-size: 0.875rem; font-family: var(--sf-font-body); border-radius: 8px; cursor: pointer; color: var(--sf-text-muted); transition: all 0.2s; }
    .sf-site-nav-link:hover { color: var(--sf-text); }
    .sf-site-nav-link.sf-nav-active { color: var(--sf-primary); background: color-mix(in srgb, var(--sf-primary) 10%, transparent); }
  ` : "";

  return `<!DOCTYPE html>
<html lang="${meta.language || "fr"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(meta.title)}</title>
  <meta name="description" content="${esc(meta.description)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontUrl}" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    :root { ${cssVars} }
    body { font-family: var(--sf-font-body); font-weight: var(--sf-font-body-weight); color: var(--sf-text); background: var(--sf-background); line-height: 1.7; -webkit-font-smoothing: antialiased; }
    h1,h2,h3,h4,h5,h6 { font-family: var(--sf-font-heading); font-weight: var(--sf-font-heading-weight); line-height: 1.15; letter-spacing: -0.02em; }
    a { text-decoration: none; color: inherit; }
    img { max-width: 100%; display: block; }
    ${navCSS}

    /* Layout */
    .sf-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .sf-section { padding: 96px 0; }
    .sf-bg-surface { background: var(--sf-surface); }
    .sf-text-center { text-align: center; }
    .sf-text-muted { color: var(--sf-text-muted); }
    .sf-text-sm { font-size: 0.875rem; }
    .sf-text-lg { font-size: 1.125rem; line-height: 1.8; }

    /* Typography */
    .sf-h1 { font-size: clamp(2.5rem, 6vw, 5rem); color: var(--sf-text); margin-bottom: 1rem; }
    .sf-h2 { font-size: clamp(2rem, 4vw, 3.2rem); color: var(--sf-text); margin-bottom: 1rem; }
    .sf-h3 { font-size: 1.25rem; color: var(--sf-text); margin-bottom: 0.5rem; }
    .sf-subtitle { font-size: 1.2rem; color: var(--sf-text-muted); max-width: 640px; margin: 0 auto 2.5rem; }

    /* Buttons */
    .sf-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; font-size: 1rem; font-weight: 600; border-radius: var(--sf-radius); background: var(--sf-primary); color: var(--sf-background); border: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; font-family: var(--sf-font-body); }
    .sf-btn:hover { transform: scale(1.03); box-shadow: 0 8px 30px rgba(0,0,0,0.15); }
    .sf-btn-inverse { background: var(--sf-background); color: var(--sf-primary); }
    .sf-btn-full { width: 100%; justify-content: center; }

    /* Grid */
    .sf-grid-2 { display: grid; grid-template-columns: 1fr; gap: 48px; }
    .sf-grid-3 { display: grid; grid-template-columns: 1fr; gap: 24px; margin-top: 48px; }
    @media(min-width:640px) { .sf-grid-3 { grid-template-columns: repeat(2, 1fr); } }
    @media(min-width:1024px) { .sf-grid-2 { grid-template-columns: repeat(2, 1fr); } .sf-grid-3 { grid-template-columns: repeat(3, 1fr); } }

    /* Hero */
    .sf-hero { position: relative; min-height: 90vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .sf-hero-bg { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, var(--sf-primary), transparent 70%); opacity: 0.12; }
    .sf-hero-center { position: relative; text-align: center; }
    .sf-hero-split { min-height: 90vh; display: flex; align-items: center; }
    .sf-hero-split-grid { display: grid; grid-template-columns: 1fr; gap: 48px; }
    @media(min-width:1024px) { .sf-hero-split-grid { grid-template-columns: 1fr 1fr; } }
    .sf-hero-visual { display: none; }
    @media(min-width:1024px) { .sf-hero-visual { display: block; } }
    .sf-hero-gradient { width: 100%; aspect-ratio: 1; border-radius: 24px; background: linear-gradient(135deg, var(--sf-primary), var(--sf-secondary), var(--sf-accent)); opacity: 0.8; }

    /* Cards */
    .sf-card { padding: 32px; border-radius: 16px; border: 1px solid var(--sf-border); background: var(--sf-background); transition: transform 0.3s, box-shadow 0.3s; }
    .sf-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
    .sf-card-icon { font-size: 2rem; margin-bottom: 16px; }

    /* Testimonials */
    .sf-testimonial-card { padding: 32px; border-radius: 16px; border: 1px solid var(--sf-border); background: var(--sf-background); display: flex; flex-direction: column; height: 100%; }
    .sf-quote-mark { font-size: 2.5rem; opacity: 0.3; color: var(--sf-primary); font-family: Georgia, serif; line-height: 1; }
    .sf-quote-text { flex: 1; font-style: italic; margin: 12px 0 24px; line-height: 1.7; }
    .sf-quote-author { display: flex; align-items: center; gap: 12px; }
    .sf-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--sf-primary); color: var(--sf-background); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; }
    .sf-author-name { font-weight: 600; font-size: 0.875rem; }

    /* Highlights */
    .sf-highlights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .sf-highlight { padding: 20px; border-radius: 12px; border: 1px solid var(--sf-border); background: var(--sf-surface); }
    .sf-highlight-num { width: 32px; height: 32px; border-radius: 8px; background: var(--sf-primary); color: var(--sf-background); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; margin-bottom: 12px; }

    /* Gallery */
    .sf-gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 48px; }
    @media(min-width:768px) { .sf-gallery-grid { grid-template-columns: repeat(3, 1fr); } }
    .sf-gallery-item { aspect-ratio: 1; border-radius: 16px; overflow: hidden; position: relative; }
    .sf-gallery-gradient { position: absolute; inset: 0; opacity: 0.7; transition: transform 0.5s; }
    .sf-gallery-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
    .sf-gallery-item:hover .sf-gallery-gradient, .sf-gallery-item:hover .sf-gallery-img { transform: scale(1.1); }

    /* CTA */
    .sf-cta { position: relative; padding: 96px 0; background: var(--sf-primary); overflow: hidden; }
    .sf-cta-bg { position: absolute; inset: 0; background: radial-gradient(circle at 80% 20%, var(--sf-accent), transparent 60%); opacity: 0.2; }
    .sf-cta h2, .sf-cta-h2 { color: var(--sf-background); font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 1rem; position: relative; }
    .sf-cta-sub { color: var(--sf-background); opacity: 0.8; font-size: 1.2rem; max-width: 600px; margin: 0 auto 2rem; position: relative; }

    /* Pricing */
    .sf-pricing-card { padding: 32px; border-radius: 16px; border: 1px solid var(--sf-border); background: var(--sf-background); display: flex; flex-direction: column; position: relative; transition: transform 0.3s; }
    .sf-pricing-card:hover { transform: translateY(-4px); }
    .sf-pricing-highlighted { background: var(--sf-primary); border-color: var(--sf-primary); color: var(--sf-background); }
    .sf-pricing-highlighted .sf-h3, .sf-pricing-highlighted .sf-pricing-price { color: var(--sf-background); }
    .sf-pricing-highlighted li { color: var(--sf-background); }
    .sf-pricing-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--sf-accent); color: var(--sf-background); padding: 4px 16px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; }
    .sf-pricing-price { font-size: 2.5rem; font-weight: 700; color: var(--sf-primary); margin: 8px 0 24px; font-family: var(--sf-font-heading); }
    .sf-pricing-features { list-style: none; flex: 1; margin-bottom: 24px; }
    .sf-pricing-features li { padding: 6px 0; font-size: 0.875rem; color: var(--sf-text-muted); }

    /* FAQ */
    .sf-faq-list { max-width: 768px; margin: 48px auto 0; }
    .sf-faq-item { border: 1px solid var(--sf-border); border-radius: 12px; background: var(--sf-surface); margin-bottom: 12px; overflow: hidden; }
    .sf-faq-q { padding: 20px 24px; cursor: pointer; font-weight: 500; font-size: 1rem; list-style: none; display: flex; justify-content: space-between; }
    .sf-faq-q::after { content: "+"; color: var(--sf-primary); font-size: 1.25rem; }
    .sf-faq-item[open] .sf-faq-q::after { content: "−"; }
    .sf-faq-a { padding: 0 24px 20px; color: var(--sf-text-muted); font-size: 0.875rem; line-height: 1.7; }
    .sf-faq-q::-webkit-details-marker { display: none; }

    /* Contact */
    .sf-contact-grid { align-items: start; }
    .sf-contact-info { margin-bottom: 24px; }
    .sf-contact-info strong { display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sf-text-muted); margin-bottom: 4px; }
    .sf-form { display: flex; flex-direction: column; gap: 12px; }
    .sf-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .sf-input { width: 100%; padding: 12px 16px; border-radius: var(--sf-radius); border: 1px solid var(--sf-border); background: var(--sf-background); color: var(--sf-text); font-family: var(--sf-font-body); font-size: 0.875rem; outline: none; transition: border-color 0.2s; }
    .sf-input:focus { border-color: var(--sf-primary); }
    textarea.sf-input { resize: none; }

    /* Footer */
    .sf-footer { padding: 48px 0; background: var(--sf-secondary); border-top: 1px solid var(--sf-border); }
    .sf-footer-inner { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 24px; }
    .sf-footer-brand { font-size: 1.125rem; font-weight: 600; font-family: var(--sf-font-heading); }
    .sf-footer-links { display: flex; gap: 24px; }
    .sf-footer-link { font-size: 0.875rem; color: var(--sf-text-muted); transition: color 0.2s; }
    .sf-footer-link:hover { text-decoration: underline; }
    .sf-footer-copyright { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--sf-border); text-align: center; font-size: 0.75rem; color: var(--sf-text-muted); }

    /* Scroll Reveal Animations */
    .sf-reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .sf-reveal.sf-visible { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body>
${bodyContent}
<script>
  ${pageScript}
  // Scroll reveal via IntersectionObserver
  function sfInitReveal() {
    var els = document.querySelectorAll('.sf-reveal:not(.sf-visible)');
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) { e.target.classList.add('sf-visible'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.1, rootMargin: '-40px' });
      els.forEach(function(el) { obs.observe(el); });
    } else {
      els.forEach(function(el) { el.classList.add('sf-visible'); });
    }
  }
  document.addEventListener('DOMContentLoaded', sfInitReveal);
</script>
</body>
</html>`;
}

/** Escape HTML entities */
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Trigger download of the HTML file */
export function downloadSiteHTML(config: SiteConfig, filename?: string): void {
  const html = exportSiteToHTML(config);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `${config.meta.title || "site"}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
