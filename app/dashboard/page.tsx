"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type Score = { id: number; listening: number; reading: number; writing: number; speaking: number; overall: number; test_type: string; created_at: string };

export default function Dashboard() {
  const sb = createClient();
  const [rows, setRows] = useState<Score[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await sb.auth.getUser();
      setEmail(user?.email ?? null);
      if (user) {
        const { data } = await sb.from("scores").select("*").order("created_at", { ascending: false });
        setRows(data ?? []);
      }
      setReady(true);
    })();
  }, []);

  if (!ready) return <p className="mu mt-6">Yuklanmoqda...</p>;
  if (!email) return <div className="card mt-6">Tarixni ko’rish uchun <Link href="/login" className="underline">kiring</Link>.</div>;

  return (
    <div className="card mt-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Tarix</h2>
        <button className="underline mu text-sm" onClick={async () => { await sb.auth.signOut(); location.href = "/"; }}>Chiqish ({email})</button>
      </div>
      {rows.length === 0 && <p className="mu">Hali natija yo’q. Hisoblagichda saqlang.</p>}
      {rows.map((x) => (
        <div key={x.id} className="flex justify-between py-2 border-b border-[#262c36]">
          <span>{new Date(x.created_at).toLocaleDateString("uz-UZ")} · {x.test_type === "A" ? "Academic" : "General"}<br /><span className="mu text-sm">L {x.listening} R {x.reading} W {x.writing} S {x.speaking}</span></span>
          <b className="text-2xl text-green-400">{Number(x.overall).toFixed(1)}</b>
        </div>
      ))}
    </div>
  );
}
