import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

const FREE_LIMIT = 1, PRO_LIMIT = 20;

const SYSTEM = `You are a strict IELTS Writing examiner. Score the essay with the official 4 criteria: Task Achievement/Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy. Use bands 0-9 in 0.5 steps. Be realistic, do not inflate. Penalize under-length responses. Write comments, errors and tips in Uzbek (Latin script), quoting English examples where useful.
Reply with ONLY valid JSON, no markdown:
{"overall":number,"criteria":[{"name":string,"band":number,"comment":string}],"errors":[string],"tips":[string]}`;

export async function POST(req: Request) {
  const sb = await createServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "login" }, { status: 401 });

  const { task, text } = await req.json();
  if (typeof text !== "string" || text.length < 50 || text.length > 6000)
    return NextResponse.json({ error: "Matn uzunligi noto’g’ri." }, { status: 400 });

  const { data: p } = await sb.from("profiles").select("pro_until").eq("id", user.id).single();
  const pro = !!p?.pro_until && new Date(p.pro_until) > new Date();
  const limit = pro ? PRO_LIMIT : FREE_LIMIT;
  const start = new Date(); start.setUTCHours(0, 0, 0, 0);
  const { count } = await sb.from("checks").select("id", { count: "exact", head: true })
    .eq("user_id", user.id).eq("kind", "writing").gte("created_at", start.toISOString());
  if ((count ?? 0) >= limit)
    return NextResponse.json({ error: pro ? "Bugungi limit tugadi." : "Bepul limit tugadi. Pro’ga o’ting." }, { status: 429 });

  try {
    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "x-goog-api-key": process.env.GEMINI_API_KEY!, "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: "user", parts: [{ text: `IELTS Writing Task ${task}.\n\nEssay:\n${text}` }] }],
        generationConfig: { responseMimeType: "application/json", maxOutputTokens: 2000 },
      }),
    });
    const d = await r.json();
    if (!r.ok) {
      console.error(d);
      return NextResponse.json({ error: r.status === 429 ? "AI limiti band, birozdan keyin urinib ko’ring." : "AI xatosi." }, { status: 502 });
    }
    const raw = (d.candidates?.[0]?.content?.parts ?? []).map((x: { text?: string }) => x.text ?? "").join("");
    const result = JSON.parse(raw.match(/\{[\s\S]*\}/)![0]);
    await sb.from("checks").insert({ user_id: user.id, kind: "writing", input_text: text, result });
    return NextResponse.json({ result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Tekshirishda xatolik. Qayta urinib ko’ring." }, { status: 500 });
  }
}