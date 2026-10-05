import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Central Supabase Cloud Project Configuration (EV Cyber Academy)
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://otyujnykypxqfiawryse.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_5Q5PlGPQu19NlZnd1OY2lg_auGTBNT6';

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.length > 0 &&
    !supabaseUrl.includes('your-project-ref') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.length > 0 &&
    !supabaseAnonKey.includes('your-supabase-anon-key')
  );
};

// Central Supabase Client with Realtime WebSocket support
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export { supabaseUrl, supabaseAnonKey };
