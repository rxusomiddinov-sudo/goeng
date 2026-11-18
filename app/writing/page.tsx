"use client";
import { useState } from "react";
import Link from "next/link";

type Result = {
  overall: number;
  criteria: { name: string; band: number; comment: string }[];
  errors: string[];
  tips: string[];
};

export default function Writing() {
  const [task, setTask] = useState<"1" | "2">("2");
  const [text, setText] = useState("");
  const [res, setRes] = useState<Result | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const min = task === "1" ? 150 : 250;

  async function check() {
    setLoading(true); setErr(""); setRes(null);
    const r = await fetch("/api/check-writing", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, text }),
    });
    const d = await r.json();
    setLoading(false);
    if (!r.ok) return setErr(d.error === "login" ? "Tekshirish uchun avval kiring." : d.error);
    setRes(d.result);
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="card space-y-3">
        <h2 className="text-xl font-bold">Writing tekshiruvi</h2>
        <div className="flex gap-2">
          {(["1", "2"] as const).map((x) => (
            <button key={x} onClick={() => setTask(x)} className={`px-4 py-2 rounded-lg font-semibold ${task === x ? "bg-green-400 text-black" : "border border-[#262c36]"}`}>Task {x}</button>
          ))}
        </div>
        <textarea rows={12} value={text} onChange={(e) => setText(e.target.value)} placeholder="Inshoingizni shu yerga yozing..." />
        <p className="mu text-sm">{words} so’z (kamida {min})</p>
        <button className="btn" disabled={loading || words < 30} onClick={check}>{loading ? "Tekshirilmoqda..." : "Tekshirish"}</button>
        {err && <p className="text-red-400">{err} {err.includes("kiring") && <Link href="/login" className="underline">Kirish</Link>}</p>}
      </div>
      {res && (
        <div className="card space-y-3">
          <div className="text-5xl font-extrabold text-green-400">{res.overall.toFixed(1)}</div>
          {res.criteria.map((c) => (
            <div key={c.name}><b>{c.name}: {c.band}</b><p className="mu text-sm">{c.comment}</p></div>
          ))}
          <div><b>Xatolar</b><ul className="list-disc pl-5 mu text-sm">{res.errors.map((e, i) => <li key={i}>{e}</li>)}</ul></div>
          <div><b>Tavsiyalar</b><ul className="list-disc pl-5 mu text-sm">{res.tips.map((e, i) => <li key={i}>{e}</li>)}</ul></div>
          <p className="mu text-xs">Bu AI’ning taxminiy bahosi, rasmiy IELTS natijasi emas.</p>
        </div>
      )}
    </div>
  );
}
