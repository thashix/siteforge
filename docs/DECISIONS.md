# Décisions d'Architecture — SiteForge

## ADR-001 : L'IA ne génère pas de HTML

**Décision** : L'IA produit un JSON structuré (SiteBrief), jamais du HTML ou du code.

**Raison** : Le HTML généré par LLM est imprévisible, non-maintenable, et impossible à éditer proprement. En séparant l'analyse (IA) de la composition (logique déterministe) et du rendu (React), on garantit la qualité visuelle et la cohérence.

**Conséquence** : Le moteur de composition doit être suffisamment riche pour couvrir tous les cas. On compense en ayant des variantes de sections.

---

## ADR-002 : Architecture JSON-driven

**Décision** : Un site généré est entièrement décrit par un objet `SiteConfig` (JSON).

**Raison** : Permet la sérialisation, le stockage, l'édition, le versioning, et le rendu côté client ou serveur sans ambiguïté.

---

## ADR-003 : Sections prédéfinies avec variantes

**Décision** : Chaque type de section (hero, services, etc.) est un composant React avec plusieurs variantes visuelles.

**Raison** : Qualité garantie (chaque variante est designée et testée), tout en offrant de la diversité. L'IA choisit la variante appropriée au secteur/ton.

---

## ADR-004 : Supabase pour auth + DB + storage

**Décision** : Utiliser Supabase comme backend-as-a-service.

**Raison** : Réduit drastiquement le temps de setup pour auth, PostgreSQL hébergé, et storage. Permet de se concentrer sur le produit. Migration vers infra propre possible plus tard.

---

## ADR-005 : Thème via CSS custom properties

**Décision** : Le thème (couleurs, fonts) est injecté via CSS variables, pas via props React.

**Raison** : Permet aux sections de lire le thème sans prop-drilling, facilite le changement de thème à chaud, et sépare le styling de la logique.

---

## ADR-006 : Prisma comme ORM

**Décision** : Utiliser Prisma pour l'accès DB.

**Raison** : Typage fort synchronisé avec le schéma, migrations gérées, excellent DX avec TypeScript. Le SiteConfig est stocké en JSON dans un champ Prisma `Json`.

---

## ADR-007 : MVP one-page uniquement

**Décision** : Le MVP génère des sites one-page (landing page scrollable).

**Raison** : Réduit considérablement la complexité (pas de routing, pas de navigation multi-pages) tout en couvrant 90% des besoins de la cible MVP (indépendants, TPE).
