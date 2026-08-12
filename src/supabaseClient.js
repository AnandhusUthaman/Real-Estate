import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://umfyqgavktskhicrsrgi.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_3bKsU9UNoVoml6ev8R2YjA_Bk_PB0FR';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
