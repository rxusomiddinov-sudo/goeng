"use client";
import { useState } from "react";
import { LISTENING, ACADEMIC, GENERAL, band, roundOverall } from "@/lib/band";
import { createClient } from "@/lib/supabase";

const bands = Array.from({ length: 13 }, (_, i) => 9 - i * 0.5);

export default function Calculator() {
  const [type, setType] = useState<"A" | "G">("A");
  const [l, setL] = useState(30), [r, setR] = useState(30);
  const [w, setW] = useState(6.5), [s, setS] = useState(6.5), [t, setT] = useState(7);
  const [msg, setMsg] = useState("");
  const bl = band(LISTENING, l), br = band(type === "A" ? ACADEMIC : GENERAL, r);
  const sum = bl + br + w + s, ov = roundOverall(sum), need = 4 * t - 1 - sum;

  async function save() {
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return setMsg("Saqlash uchun avval kiring.");
    const { error } = await sb.from("scores").insert({
      user_id: user.id, listening: bl, reading: br, writing: w, speaking: s, overall: ov, test_type: type,
    });
    setMsg(error ? error.message : "Saqlandi");
  }

  const sel = (v: number, f: (n: number) => void) => (
    <select value={v} onChange={(e) => f(Number(e.target.value))}>
      {bands.map((b) => <option key={b} value={b}>{b.toFixed(1)}</option>)}
    </select>
  );

  return (
    <div className="space-y-4 mt-4">
      <div className="card space-y-3">
        <h2 className="text-xl font-bold">Band hisoblagich</h2>
        <div className="flex gap-2">
          {(["A", "G"] as const).map((x) => (
            <button key={x} onClick={() => setType(x)} className={`px-4 py-2 rounded-lg font-semibold ${type === x ? "bg-green-400 text-black" : "border border-[#262c36]"}`}>
              {x === "A" ? "Academic" : "General Training"}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <label>Listening (0-40)<input type="number" min={0} max={40} value={l} onChange={(e) => setL(Math.min(40, Math.max(0, Number(e.target.value))))} /></label>
          <label>Reading (0-40)<input type="number" min={0} max={40} value={r} onChange={(e) => setR(Math.min(40, Math.max(0, Number(e.target.value))))} /></label>
          <label>Writing (band){sel(w, setW)}</label>
          <label>Speaking (band){sel(s, setS)}</label>
          <label>Maqsadli band{sel(t, setT)}</label>
        </div>
      </div>
      <div className="card space-y-2">
        <div className="mu text-sm">Overall band</div>
        <div className="text-6xl font-extrabold text-green-400">{ov.toFixed(1)}</div>
        <p className="mu text-sm">L {bl} · R {br} · W {w} · S {s}</p>
        <p>{need <= 0 ? `Maqsadingiz ${t.toFixed(1)} ga yetdingiz.` : `Maqsad ${t.toFixed(1)} uchun bandlar yig’indisini yana ${need.toFixed(1)} ballga oshirish kerak.`}</p>
        <button className="btn" onClick={save}>Natijani saqlash</button>
        {msg && <p className="mu text-sm">{msg}</p>}
      </div>
    </div>
  );
}
