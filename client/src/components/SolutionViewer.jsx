import { useState, useEffect, useRef } from "react";
import StackCol from "./StackCol";
import StatCard from "./StatCard";

export default function SolutionViewer({ steps, numStacks }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => { setStep(0); setPlaying(false); }, [steps]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStep(p => {
          if (p >= steps.length - 1) { setPlaying(false); return p; }
          return p + 1;
        });
      }, 750);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, steps.length]);

  const cur = steps[step];
  const parsedStacks = Array.from({ length: numStacks }, (_, i) =>
    (cur.stacks[i] ?? "").trim().split("").filter(Boolean)
  );
  const totalMoves = steps[steps.length - 1].move;

  const btnBase = "px-3 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium transition-colors border border-zinc-600 disabled:opacity-40";

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <StatCard label="Solution length" value={totalMoves} />
        <StatCard label="Step" value={`${step} / ${steps.length-1}`} />
        <StatCard label="h(n)" value={cur.heuristic} />
        <StatCard label="f(n)" value={cur.fn} />
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(numStacks, 8)}, minmax(0, 1fr))` }}>
        {parsedStacks.map((blocks, i) => (
          <StackCol key={i} index={i} blocks={blocks} editable={false} />
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <button className={btnBase} onClick={() => { setPlaying(false); setStep(0); }}>⏮</button>
        <button className={btnBase} onClick={() => { setPlaying(false); setStep(s => Math.max(0, s - 1)); }}>‹</button>
        <button
          className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors border border-blue-500"
          onClick={() => setPlaying(p => !p)}
        >
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>
        <button className={btnBase} onClick={() => { setPlaying(false); setStep(s => Math.min(steps.length - 1, s + 1)); }}>›</button>
        <button className={btnBase} onClick={() => { setPlaying(false); setStep(steps.length - 1); }}>⏭</button>
      </div>

      <input
        type="range" min={0} max={steps.length - 1} value={step} step={1}
        onChange={e => { setPlaying(false); setStep(+e.target.value); }}
        className="w-full accent-blue-500"
      />
    </div>
  );
}