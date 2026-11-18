"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState(""), [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    const { error } = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (error) return setMsg(error.message);
    if (mode === "signup") return setMsg("Emailingizga tasdiq xati yuborildi.");
    window.location.href = "/dashboard";
  }

  return (
    <form onSubmit={submit} className="card max-w-sm mx-auto mt-10 space-y-3">
      <h1 className="text-2xl font-bold">{mode === "login" ? "Kirish" : "Ro’yxatdan o’tish"}</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Parol (kamida 6 belgi)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
      <button className="btn w-full">{mode === "login" ? "Kirish" : "Ro’yxatdan o’tish"}</button>
      <button type="button" className="text-sm underline" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
        {mode === "login" ? "Hisobingiz yo’qmi? Ro’yxatdan o’ting" : "Hisobingiz bormi? Kiring"}
      </button>
      {msg && <p className="text-sm mu">{msg}</p>}
    </form>
  );
}
