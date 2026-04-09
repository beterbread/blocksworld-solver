export default function SliderControl({ label, min, max, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-zinc-400 text-sm whitespace-nowrap w-36">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={1}
        onChange={e => onChange(+e.target.value)}
        className="w-32 accent-blue-500"
      />
      <span className="text-white text-sm font-semibold tabular-nums w-6">{value}</span>
    </div>
  );
}