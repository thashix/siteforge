import { supabase } from "./supabase";

// =============================================================================
// CREDITS SERVICE — Supabase DB
// =============================================================================

export const CREDIT_COSTS = {
  generate: 30,
  regenerate: 3,
  export: 0,
  addSection: 5,
  addPage: 10,
  rewrite: 2,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "starter", name: "Starter", credits: 10, price: 9 },
  { id: "pro", name: "Pro", credits: 30, price: 19, popular: true },
  { id: "business", name: "Business", credits: 100, price: 49 },
];

// -- Read credits -------------------------------------------------------------

export async function getCreditsFromDB(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return getCreditsLocal();

  const { data } = await supabase
    .from("credits")
    .select("balance")
    .eq("user_id", user.id)
    .single();

  return data?.balance ?? 0;
}

/** Sync version for UI (reads from cache) */
let cachedBalance: number | null = null;

export function getCredits(): number {
  if (cachedBalance !== null) return cachedBalance;
  // Fallback to localStorage for initial render
  return getCreditsLocal();
}

export function setCachedBalance(balance: number) {
  cachedBalance = balance;
}

// -- Check credits ------------------------------------------------------------

export function hasCredits(action: CreditAction): boolean {
  return getCredits() >= CREDIT_COSTS[action];
}

export function getCost(action: CreditAction): number {
  return CREDIT_COSTS[action];
}

// -- Use credits --------------------------------------------------------------

export async function useCreditsDB(action: CreditAction): Promise<boolean> {
  const cost = CREDIT_COSTS[action];
  if (cost === 0) return true;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Fallback localStorage
    return useCreditsLocal(action);
  }

  // Get current balance
  const { data: creditData } = await supabase
    .from("credits")
    .select("balance, total_used")
    .eq("user_id", user.id)
    .single();

  if (!creditData || creditData.balance < cost) return false;

  // Deduct
  const { error } = await supabase
    .from("credits")
    .update({
      balance: creditData.balance - cost,
      total_used: creditData.total_used + cost,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("[Credits] Deduct error:", error);
    return false;
  }

  // Log transaction
  await supabase.from("credit_transactions").insert({
    user_id: user.id,
    type: "usage",
    amount: -cost,
    action,
    description: getActionDescription(action),
  });

  cachedBalance = creditData.balance - cost;
  return true;
}

/** Sync wrapper — tries DB, falls back to local */
export function useCredits(action: CreditAction): boolean {
  const cost = CREDIT_COSTS[action];
  if (cost === 0) return true;

  // Optimistic local deduct for immediate UI feedback
  const current = getCredits();
  if (current < cost) return false;
  cachedBalance = current - cost;

  // Fire async DB update
  useCreditsDB(action).catch(console.error);
  return true;
}

// -- Add credits --------------------------------------------------------------

export async function addCreditsDB(amount: number, packName: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    addCreditsLocal(amount, packName);
    return;
  }

  const { data: creditData } = await supabase
    .from("credits")
    .select("balance, total_purchased")
    .eq("user_id", user.id)
    .single();

  if (!creditData) return;

  await supabase
    .from("credits")
    .update({
      balance: creditData.balance + amount,
      total_purchased: creditData.total_purchased + amount,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  await supabase.from("credit_transactions").insert({
    user_id: user.id,
    type: "purchase",
    amount,
    description: `Achat pack ${packName} (${amount} crédits)`,
  });

  cachedBalance = creditData.balance + amount;
}

export function addCredits(amount: number, packName: string): void {
  const current = getCredits();
  cachedBalance = current + amount;
  addCreditsDB(amount, packName).catch(console.error);
}

// -- Refresh cache from DB ----------------------------------------------------

export async function refreshCredits(): Promise<number> {
  const balance = await getCreditsFromDB();
  cachedBalance = balance;
  return balance;
}

// -- LocalStorage fallback (for non-logged-in users) --------------------------

const LS_KEY = "siteforge_credits";

function getCreditsLocal(): number {
  if (typeof window === "undefined") return 5;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw).balance ?? 5;
  } catch {}
  // Initialize
  localStorage.setItem(LS_KEY, JSON.stringify({ balance: 5 }));
  return 5;
}

function useCreditsLocal(action: CreditAction): boolean {
  const balance = getCreditsLocal();
  const cost = CREDIT_COSTS[action];
  if (balance < cost) return false;
  localStorage.setItem(LS_KEY, JSON.stringify({ balance: balance - cost }));
  cachedBalance = balance - cost;
  return true;
}

function addCreditsLocal(amount: number, _packName: string): void {
  const balance = getCreditsLocal();
  localStorage.setItem(LS_KEY, JSON.stringify({ balance: balance + amount }));
  cachedBalance = balance + amount;
}

// -- Helpers ------------------------------------------------------------------

function getActionDescription(action: CreditAction): string {
  const descriptions: Record<CreditAction, string> = {
    generate: "Génération de site (IA)",
    regenerate: "Modification de section (IA)",
    export: "Export HTML",
    addSection: "Ajout de section (IA)",
    addPage: "Ajout de page (IA)",
    rewrite: "Réécriture de texte (IA)",
  };
  return descriptions[action];
}

export function resetCredits(): void {
  cachedBalance = null;
  localStorage.removeItem(LS_KEY);
}

export interface CreditState {
  balance: number;
  totalPurchased: number;
  totalUsed: number;
  history: Array<{
    id: string;
    type: string;
    amount: number;
    action?: string;
    description: string;
    timestamp: string;
  }>;
}

export function getCreditState(): CreditState {
  return {
    balance: getCredits(),
    totalPurchased: 0,
    totalUsed: 0,
    history: [],
  };
}
