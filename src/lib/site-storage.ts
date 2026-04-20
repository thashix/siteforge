import { supabase } from "./supabase";
import type { SiteBrief, SiteConfig } from "@/types";

// =============================================================================
// SITE STORAGE — Supabase DB
// =============================================================================

export interface StoredSite {
  id: string;
  name: string;
  slug: string;
  brief: SiteBrief;
  config: SiteConfig;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

// -- Get all sites ------------------------------------------------------------

export async function getAllSitesDB(): Promise<StoredSite[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return getAllSitesLocal();

  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map(mapDbSite);
}

/** Sync version — uses localStorage cache */
export function getAllSites(): StoredSite[] {
  return getAllSitesLocal();
}

// -- Get site by ID -----------------------------------------------------------

export async function getSiteByIdDB(id: string): Promise<StoredSite | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return getSiteByIdLocal(id);

  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return getSiteByIdLocal(id);
  return mapDbSite(data);
}

export function getSiteById(id: string): StoredSite | null {
  return getSiteByIdLocal(id);
}

// -- Create site --------------------------------------------------------------

export async function createSiteDB(
  name: string,
  brief: SiteBrief,
  config: SiteConfig
): Promise<StoredSite> {
  const slug = generateSlug(name);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return createSiteLocal(name, brief, config);

  const { data, error } = await supabase
    .from("sites")
    .insert({
      user_id: user.id,
      name,
      slug,
      brief,
      config,
      status: "draft",
    })
    .select()
    .single();

  if (error || !data) {
    console.error("[Sites] Create error:", error);
    return createSiteLocal(name, brief, config);
  }

  // Also save locally for immediate access
  const site = mapDbSite(data);
  saveSiteLocal(site);
  return site;
}

export function createSite(name: string, brief: SiteBrief, config: SiteConfig): StoredSite {
  const site = createSiteLocal(name, brief, config);
  // Fire async DB save
  createSiteDB(name, brief, config).catch(console.error);
  return site;
}

// -- Update site config -------------------------------------------------------

export async function updateSiteConfigDB(id: string, config: SiteConfig): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    await supabase
      .from("sites")
      .update({ config, updated_at: new Date().toISOString() })
      .eq("id", id);
  }

  updateSiteConfigLocal(id, config);
}

export function updateSiteConfig(id: string, config: SiteConfig): StoredSite | null {
  const result = updateSiteConfigLocal(id, config);
  updateSiteConfigDB(id, config).catch(console.error);
  return result;
}

// -- Delete site --------------------------------------------------------------

export async function deleteSiteDB(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("sites").delete().eq("id", id);
  }

  deleteSiteLocal(id);
}

export function deleteSite(id: string): boolean {
  deleteSiteDB(id).catch(console.error);
  return deleteSiteLocal(id);
}

// -- Publish site -------------------------------------------------------------

export function publishSite(id: string): StoredSite | null {
  const sites = getAllSitesLocal();
  const idx = sites.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  sites[idx].status = "published";
  sites[idx].updatedAt = new Date().toISOString();
  saveSitesLocal(sites);
  return sites[idx];
}

// -- DB → StoredSite mapper ---------------------------------------------------

function mapDbSite(row: Record<string, unknown>): StoredSite {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    brief: row.brief as SiteBrief,
    config: row.config as SiteConfig,
    status: (row.status as "draft" | "published") || "draft",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// -- LocalStorage fallback ----------------------------------------------------

const LS_KEY = "siteforge_sites";

function getAllSitesLocal(): StoredSite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function getSiteByIdLocal(id: string): StoredSite | null {
  return getAllSitesLocal().find((s) => s.id === id) ?? null;
}

function createSiteLocal(name: string, brief: SiteBrief, config: SiteConfig): StoredSite {
  const sites = getAllSitesLocal();
  const site: StoredSite = {
    id: generateId(),
    name,
    slug: generateSlug(name),
    brief,
    config,
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  sites.unshift(site);
  saveSitesLocal(sites);
  return site;
}

function saveSiteLocal(site: StoredSite): void {
  const sites = getAllSitesLocal();
  const idx = sites.findIndex((s) => s.id === site.id);
  if (idx >= 0) sites[idx] = site;
  else sites.unshift(site);
  saveSitesLocal(sites);
}

function updateSiteConfigLocal(id: string, config: SiteConfig): StoredSite | null {
  const sites = getAllSitesLocal();
  const idx = sites.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  sites[idx].config = config;
  sites[idx].updatedAt = new Date().toISOString();
  saveSitesLocal(sites);
  return sites[idx];
}

function deleteSiteLocal(id: string): boolean {
  const sites = getAllSitesLocal();
  const filtered = sites.filter((s) => s.id !== id);
  if (filtered.length === sites.length) return false;
  saveSitesLocal(filtered);
  return true;
}

function saveSitesLocal(sites: StoredSite[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(sites));
}

function generateId(): string {
  return `site_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateSlug(name: string): string {
  const base = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}
