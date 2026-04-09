export default function About() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="border-b border-zinc-700 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "'Georgia', serif" }}>Blocksworld Solver</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Configure initial and goal states, then solve with the A* algorithm.
          </p>
        </div>
      </div>
    </div>
  );
}