import { useState, useCallback } from "react";
import StackEditor from "./StackEditor";
import SolutionViewer from "./SolutionViewer";
import SliderControl from "./SliderControl";
import { ALPHABET } from "../utils/blockColors";

export default function BlocksworldApp() {
  const [numBlocks, setNumBlocks] = useState(5);
  const [numStacks, setNumStacks] = useState(3);

  const allBlocks = ALPHABET.slice(0, numBlocks);
  const emptyStacks = useCallback(n => Array.from({ length: n }, () => []), []);

  const [initialStacks, setInitialStacks] = useState([["A","B","C","D","E"], [], []]);
  const [goalStacks, setGoalStacks] = useState([["E"], ["A","C"], ["B","D"]]);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const allInInit = allBlocks.every(b => initialStacks.flat().includes(b));
  const allInGoal = allBlocks.every(b => goalStacks.flat().includes(b));
  const canSolve  = allInInit && allInGoal && !loading;

  async function solve() {
    setLoading(true); setError(null); setResult(null);
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/solve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initial: initialStacks.map(s => s.join("")),
          goal:    goalStacks.map(s => s.join("")),
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Unknown error");
      setResult(data);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="border-b border-zinc-700 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "'Georgia', serif" }}>Blocksworld Solver</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Configure initial and goal states, then solve with the A* algorithm.
          </p>
        </div>

        <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 px-6 py-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Configuration</p>
          <SliderControl
            label="Blocks"
            min={1}
            max={26}
            value={numBlocks}
            onChange={n => {
              const newBlocks = new Set(ALPHABET.slice(0, n));
              setInitialStacks(prev => prev.map(s => s.filter(b => newBlocks.has(b))));
              setGoalStacks(prev => prev.map(s => s.filter(b => newBlocks.has(b))));
              setNumBlocks(n);
              setResult(null);
              setError(null);
            }}
          />
          <SliderControl label="Stacks (columns)" min={1} max={10} value={numStacks} onChange={n => {
            setNumStacks(n);
            const si = emptyStacks(n); si[0] = initialStacks.flat(); setInitialStacks(si);
            const sg = emptyStacks(n); sg[0] = goalStacks.flat(); setGoalStacks(sg);
            setResult(null); setError(null);
          }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 px-6 py-5">
            <StackEditor label="Initial state" stacks={initialStacks} setStacks={(s) => { setInitialStacks(s); setResult(null); setError(null); }} allBlocks={allBlocks} />
          </div>
          <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 px-6 py-5">
            <StackEditor label="Goal state" stacks={goalStacks} setStacks={(s) => { setGoalStacks(s); setResult(null); setError(null); }} allBlocks={allBlocks} />
          </div>
        </div>

        <button
          onClick={solve}
          disabled={!canSolve}
          className={`w-full py-3 rounded-lg text-white font-semibold text-sm transition-colors ${
            canSolve ? "bg-blue-600 hover:bg-blue-500" : "bg-zinc-700 cursor-not-allowed"
          }`}
        >
          {loading ? "Solving..." : "Solve"}
        </button>

        {error && <div className="text-red-500 text-sm font-mono">{error}</div>}

        {result && <SolutionViewer steps={result.steps} numStacks={numStacks} />}
      </div>
    </div>
  );
}