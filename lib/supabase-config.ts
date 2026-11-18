const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase env kalitlari topilmadi: NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY. .env.local va Vercel > Settings > Environment Variables ga qo‘shib, qayta deploy qiling."
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}
