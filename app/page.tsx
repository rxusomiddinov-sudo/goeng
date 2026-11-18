import Link from "next/link";

export default function Home() {
  return (
    <div className="card mt-6">
      <h1 className="text-3xl font-extrabold mb-3">IELTS bandingizni <span className="text-green-400">tez</span> bilib oling</h1>
      <p className="mu mb-4">Listening va Reading’dan band, overall hisob, maqsadli bandgacha yetishmagan ball va Writing AI tekshiruvi.</p>
      <Link href="/calculator" className="btn inline-block">Hisoblashni boshlash</Link>
    </div>
  );
}
