# Roadmap — SiteForge

## Phase 0 — Cadrage ✅
- [x] Vision produit, MVP défini, architecture validée, stack choisie

## Phase 1 — Fondations ✅
- [x] Init Next.js + TypeScript + Tailwind + Framer Motion
- [x] Prisma schema (User, Site)
- [x] Types fondamentaux (SiteBrief, SiteConfig, ThemeConfig, etc.)
- [x] Validation Zod, Theme engine, Animation presets
- [x] ThemeProvider, ScrollReveal, SectionWrapper
- [x] Layouts dashboard + generator, pages dashboard + generate

## Phase 2 — Moteur de brief ✅
- [x] Prompt system complet pour l'analyse IA (palettes/fonts inline)
- [x] API route POST /api/brief/analyze
- [x] Intégration API Anthropic (Claude Sonnet)
- [x] Validation Zod du SiteBrief retourné + extraction JSON robuste
- [x] Connexion brief wizard → API → sessionStorage → preview

## Phase 3 — Sections ✅
- [x] 10 sections complètes : Hero, Services, About, Gallery, Testimonials, CTA, Pricing, FAQ, Contact, Footer
- [x] 16 variantes au total (2 par section principale)
- [x] Section Registry (mapping type → composant)
- [x] SectionProps type partagé

## Phase 4 — Theme engine complet ✅
- [x] FontLoader dynamique (Google Fonts + Fontshare)
- [x] Palettes appliquées via CSS variables sur toutes les sections
- [x] ThemeSwitcher (palette picker en live)
- [x] FontSwitcher (font pairing picker en live)
- [x] Preview avec changement de thème instantané

## Phase 5 — Site Composer ✅
- [x] Logique SiteBrief → SiteConfig (déterministe)
- [x] Sélection automatique de variantes par secteur
- [x] Ordonnancement des sections + génération d'IDs
- [x] SiteRenderer (lit SiteConfig → rend le site complet)

## Phase 6 — Preview Engine ✅ (intégré avec Phase 3-5)
- [x] Page preview/draft avec rendu complet
- [x] Animations scroll intégrées
- [x] Toggle preview / debug JSON
- [x] Toolbar d'édition (palette + fonts)

## Phase 7 — Sections complètes ✅ (intégré avec Phase 3)
- [x] Toutes les 10 sections MVP créées
- [x] Variantes supplémentaires: gallery masonry, testimonials large, services rows, etc.

## Phase 8 — Édition légère (NEXT)
- [ ] Modifier les textes inline (contentEditable ou modal)
- [ ] Réordonner les sections (drag & drop ou flèches)
- [ ] Supprimer / ajouter des sections
- [ ] Sauvegarder les modifications dans le SiteConfig

## Phase 9 — Dashboard + flow complet
- [ ] Auth Supabase (login/register)
- [ ] CRUD sites (save to DB via Prisma)
- [ ] Dashboard: liste des sites avec aperçu
- [ ] Flow complet: brief → preview → edit → save

## Phase 10 — Publication
- [ ] Sous-domaine xxx.siteforge.app
- [ ] Export HTML statique

## Phase 11 — Polish
- [ ] Responsive final
- [ ] Tests E2E
- [ ] Performances (lazy loading sections, image optimization)

## Phase 12 — Launch
- [ ] Landing page SiteForge
- [ ] Beta privée
