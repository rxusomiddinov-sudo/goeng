import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "@/lib/supabase-config";

export async function createServer() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  const store = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        for (const { name, value, options } of list) {
          try {
            store.set(name, value, options);
          } catch {}
        }
      },
    },
  });
}
