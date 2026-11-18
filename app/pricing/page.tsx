export default function Pricing() {
  return (
    <div className="grid sm:grid-cols-2 gap-4 mt-4">
      <div className="card">
        <h2 className="text-xl font-bold">Bepul</h2>
        <ul className="list-disc pl-5 mu my-3"><li>Hisoblagich</li><li>Tarix</li><li>Kuniga 1 ta Writing tekshiruvi</li></ul>
      </div>
      <div className="card border-green-400">
        <h2 className="text-xl font-bold">Pro · 1 oy</h2>
        <ul className="list-disc pl-5 mu my-3"><li>Kuniga 20 tagacha Writing tekshiruvi</li><li>Speaking (keyingi bosqich)</li></ul>
        <button className="btn" disabled>To’lov tez orada</button>
      </div>
    </div>
  );
}
