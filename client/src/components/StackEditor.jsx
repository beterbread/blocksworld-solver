import { useState } from "react";
import StackCol from "./StackCol";
import Block from "./Block";

export default function StackEditor({ label, stacks, setStacks, allBlocks }) {
  const [dragging, setDragging] = useState(null);

  const placed = stacks.flat();
  const palette = allBlocks.filter((b) => !placed.includes(b));

  function handlePickUp(letter, colIdx, blockIdx) {
    setDragging({ letter, from: colIdx, blockIdx, carried: [letter] });
  }

  function handlePickUpFromPalette(letter) {
    setDragging({ letter, from: "palette", blockIdx: 0, carried: [letter] });
  }

  function handleDrop(toIdx) {
    if (!dragging) return;
    const next = stacks.map(s => [...s]);
    if (dragging.from !== "palette") {
      next[dragging.from].splice(dragging.blockIdx, 1);
    }
    next[toIdx] = [...next[toIdx], ...dragging.carried];
    setStacks(next);
    setDragging(null);
  }

  function handleDropToPalette(e) {
    e.preventDefault();
    if (!dragging || dragging.from === "palette") { setDragging(null); return; }
    const next = stacks.map(s => [...s]);
    next[dragging.from].splice(dragging.blockIdx, 1);
    setStacks(next);
    setDragging(null);
  }

  return (
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">{label}</p>

      <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: `repeat(${Math.min(stacks.length, 8)}, minmax(0, 1fr))` }}>
        {stacks.map((blocks, i) => (
          <StackCol
            key={i}
            index={i}
            blocks={blocks}
            editable
            draggingFrom={dragging?.from === i ? { colIdx: i, blockIdx: dragging.blockIdx } : null}
            onPickUp={handlePickUp}
            onDrop={handleDrop}
          />
        ))}
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropToPalette}
        className="min-h-12 rounded-lg border border-dashed border-zinc-600 bg-zinc-800/40 p-2 flex flex-wrap gap-2 items-center transition-colors"
      >
        {palette.length === 0
          ? <span className="text-zinc-600 text-xs">all blocks placed - drag here to unplace</span>
          : palette.map(l => (
            <Block
              key={l}
              letter={l}
              draggable
              onDragStart={(e) => {
                const el = e.currentTarget;
                e.dataTransfer.setDragImage(el, el.offsetWidth / 2, el.offsetHeight / 2);
                handlePickUpFromPalette(l);
              }}
            />
          ))
        }
      </div>
    </div>
  );
}