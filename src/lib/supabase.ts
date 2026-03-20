import { createClient } from '@supabase/supabase-js';

// Using dummy URLs for the demo. In production, these should be env vars.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
