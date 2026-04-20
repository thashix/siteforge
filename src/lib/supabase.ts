import { createClient } from "@supabase/supabase-js";

// =============================================================================
// SUPABASE CLIENT
// =============================================================================
// Browser-side client for auth and data operations.
// Uses the publishable key (sb_publishable_...) — safe for client-side.
// =============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
