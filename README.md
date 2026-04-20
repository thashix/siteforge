# SiteForge

**Générez un site professionnel en 30 secondes.**

SaaS de génération de sites web modernes, responsives et animés, piloté par l'IA.

## Stack

- **Framework** : Next.js 14+ (App Router)
- **Langage** : TypeScript (strict)
- **Style** : Tailwind CSS
- **Animations** : Framer Motion
- **Base de données** : PostgreSQL via Supabase
- **ORM** : Prisma
- **Auth** : Supabase Auth
- **IA** : API Anthropic (Claude)
- **Hébergement** : Vercel

## Setup local

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env.local
# → Remplir les variables dans .env.local

# 3. Initialiser la base de données
npx prisma db push

# 4. Lancer le dev server
npm run dev
```

## Architecture

```
UserBrief (texte) → AI Analyzer → SiteBrief (JSON) → Site Composer → SiteConfig (JSON) → Render Engine (React)
```

L'IA ne génère jamais de HTML. Elle produit un brief structuré. Le moteur de composition (logique déterministe) mappe ce brief vers des sections prédéfinies. Le rendu est assuré par des composants React typés.

## Structure

```
src/
├── app/          # Next.js pages & API routes
├── core/         # Logique métier pure (brief, composer, theme, animations)
├── sections/     # Bibliothèque de sections (hero, services, contact...)
├── components/   # Composants UI réutilisables
├── lib/          # Clients et utilitaires
└── types/        # Types partagés globaux
```
