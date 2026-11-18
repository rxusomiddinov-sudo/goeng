"use client";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

function LoginForm() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [msg, setMsg] = useState("");
  const urlMsg = searchParams.get("error_description") || searchParams.get("error") || "";
  const notice = msg || urlMsg;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setMsg(error.message);
      router.replace("/dashboard");
      router.refresh();
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) return setMsg(error.message);
    if (data.session) {
      router.replace("/dashboard");
      router.refresh();
      return;
    }
    setMsg("Emailingizga tasdiq havolasi yuborildi. Havolani ochib, hisobingizni tasdiqlang.");
  }

  return (
    <form onSubmit={submit} className="card max-w-sm mx-auto mt-10 space-y-3">
      <h1 className="text-2xl font-bold">{mode === "login" ? "Kirish" : "Ro‘yxatdan o‘tish"}</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Parol (kamida 6 belgi)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
      <button className="btn w-full">{mode === "login" ? "Kirish" : "Ro‘yxatdan o‘tish"}</button>
      <button type="button" className="text-sm underline" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMsg(""); }}>
        {mode === "login" ? "Hisobingiz yo‘qmi? Ro‘yxatdan o‘ting" : "Hisobingiz bormi? Kiring"}
      </button>
      {notice && <p className="text-sm mu">{notice}</p>}
    </form>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
