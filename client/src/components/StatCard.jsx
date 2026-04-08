export default function StatCard({ label, value }) {
  return (
    <div className="flex-1 min-w-16 bg-zinc-800/60 rounded-lg px-4 py-3 border border-zinc-700">
      <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1">{label}</div>
      <div className="text-white text-xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}