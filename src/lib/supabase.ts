import { createClient } from '@supabase/supabase-js';

// Vite exposes env vars via import.meta.env (only VITE_* are exposed to client)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);