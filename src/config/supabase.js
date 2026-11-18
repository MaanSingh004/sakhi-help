// Central Supabase Cloud Database Configuration
// Set your project credentials here directly, or define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file or Render environment variables.

export const SUPABASE_CONFIG = {
  // 1. Paste your Supabase Project URL below:
  url: import.meta.env.VITE_SUPABASE_URL || "",

  // 2. Paste your Supabase Anon Public Key below:
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ""
};

// Check if credentials are properly provided
export function isSupabaseConfigured() {
  const url = (SUPABASE_CONFIG.url || "").trim();
  const key = (SUPABASE_CONFIG.anonKey || "").trim();
  return (
    url.length > 0 &&
    key.length > 0 &&
    !url.includes("your-project-id") &&
    !key.includes("your-anon-key")
  );
}
