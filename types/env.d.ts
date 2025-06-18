declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      // Note: GEMINI_API_KEY is now only used in Supabase Edge Functions
      // and should be set as a Supabase secret, not an environment variable
    }
  }
}

// Ensure this file is treated as a module
export {};