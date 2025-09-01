import { createClient } from '@supabase/supabase-js';
import { environment } from './environment.config';

export const supabaseConfig = {
  url: environment.supabase.url,
  key: environment.supabase.anonKey,
};

// Configuration Supabase prête
console.log('✅ Configuration Supabase chargée avec succès');

export const supabase = createClient(supabaseConfig.url, supabaseConfig.key);
