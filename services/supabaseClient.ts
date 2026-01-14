

import { createClient } from '@supabase/supabase-js';

// في Vite نستخدم import.meta.env بدلاً من process.env
// Fix: Casting import.meta to any to resolve TS error for env property in Vite
const supabaseUrl = ((import.meta as any).env?.VITE_SUPABASE_URL) || 'https://yxhqpyhpwumqvytobxtr.supabase.co';
// Fix: Casting import.meta to any to resolve TS error for env property in Vite
const supabaseAnonKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || 'sb_publishable_vUEs_cCB5InLpzPLPWJDBA_AN2tZRsv';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);