import { supabase } from "./supabase";

// =============================================================================
// AUTH SERVICE — Supabase Auth
// =============================================================================
// Real authentication via Supabase.
// Email + password signup/login with automatic profile creation.
// =============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResult {
  success: true;
  user: User;
}

export interface AuthError {
  success: false;
  error: string;
}

export type AuthResponse = AuthResult | AuthError;

/** Register a new user */
export async function register(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  if (!trimmedEmail || !trimmedEmail.includes("@")) {
    return { success: false, error: "Adresse email invalide" };
  }
  if (password.length < 6) {
    return { success: false, error: "Le mot de passe doit contenir au moins 6 caractères" };
  }
  if (!trimmedName) {
    return { success: false, error: "Le nom est requis" };
  }

  const { data, error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
    options: {
      data: { name: trimmedName },
    },
  });

  if (error) {
    return { success: false, error: translateError(error.message) };
  }

  if (!data.user) {
    return { success: false, error: "Erreur lors de la création du compte" };
  }

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email || trimmedEmail,
      name: trimmedName,
      createdAt: data.user.created_at || new Date().toISOString(),
    },
  };
}

/** Login with email and password */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !password) {
    return { success: false, error: "Email et mot de passe requis" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  });

  if (error) {
    return { success: false, error: translateError(error.message) };
  }

  if (!data.user) {
    return { success: false, error: "Erreur de connexion" };
  }

  const name = data.user.user_metadata?.name || data.user.email?.split("@")[0] || "";

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email || trimmedEmail,
      name,
      createdAt: data.user.created_at || new Date().toISOString(),
    },
  };
}

/** Logout */
export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

/** Get current authenticated user */
export async function getUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.name || user.email?.split("@")[0] || "",
    createdAt: user.created_at || new Date().toISOString(),
  };
}

/** Check if user is authenticated (sync check via session) */
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
}

/** Listen for auth state changes */
export function onAuthStateChange(
  callback: (user: User | null) => void
) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.user_metadata?.name || "",
        createdAt: session.user.created_at || "",
      });
    } else {
      callback(null);
    }
  });
}

/** Translate Supabase error messages to French */
function translateError(message: string): string {
  const translations: Record<string, string> = {
    "User already registered": "Cette adresse email est déjà utilisée",
    "Invalid login credentials": "Email ou mot de passe incorrect",
    "Email not confirmed": "Veuillez confirmer votre email avant de vous connecter",
    "Password should be at least 6 characters": "Le mot de passe doit contenir au moins 6 caractères",
    "Signup requires a valid password": "Mot de passe invalide",
    "Unable to validate email address: invalid format": "Format d'email invalide",
  };
  return translations[message] || message;
}
