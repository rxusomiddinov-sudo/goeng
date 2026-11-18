import Link from "next/link";

const links = [
  ["/calculator", "Hisoblagich"],
  ["/writing", "Writing"],
  ["/dashboard", "Tarix"],
  ["/pricing", "Pro"],
  ["/login", "Kirish"],
];

export default function Nav() {
  return (
    <header className="border-b border-[#262c36] sticky top-0 bg-[#0e1116] z-10">
      <div className="max-w-3xl mx-auto flex items-center gap-4 p-3 overflow-x-auto">
        <Link href="/" className="font-extrabold text-xl mr-auto">Go<span className="text-green-400">Eng</span></Link>
        {links.map(([h, t]) => (
          <Link key={h} href={h} className="mu hover:text-white whitespace-nowrap font-semibold">{t}</Link>
        ))}
      </div>
    </header>
  );
}
