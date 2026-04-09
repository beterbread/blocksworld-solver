import { useState } from "react";
import Block from "./Block";

export default function StackCol({ blocks, index, editable, onPickUp, onDrop, draggingFrom }) {
  const [over, setOver] = useState(false);
  const dragIdx = draggingFrom?.colIdx === index ? draggingFrom.blockIdx : null;

  return (
    <div className="flex flex-col items-center gap-1 min-w-0">
      <div
        onDragOver={editable ? (e) => { e.preventDefault(); setOver(true); } : undefined}
        onDragLeave={editable ? (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(false); } : undefined}
        onDrop={editable ? (e) => { e.preventDefault(); setOver(false); onDrop(index); } : undefined}
        className={`
          flex flex-col-reverse items-center gap-1
          w-14 rounded-lg border transition-all duration-150
          ${over ? "border-blue-400 bg-blue-950/60" : "border-zinc-700 bg-zinc-800/60"}
        `}
        style={{ minHeight: "14rem", padding: "8px 8px 6px" }}
      >
        {blocks.map((letter, i) => (
          <Block
            key={`${letter}-${i}`}
            letter={letter}
            draggable={editable}
            isBeingDragged={dragIdx === i}
            onDragStart={editable ? (e) => {
              const el = e.currentTarget;
              e.dataTransfer.setDragImage(el, el.offsetWidth / 2, el.offsetHeight / 2);
              onPickUp(letter, index, i);
            } : undefined}
          />
        ))}

        {blocks.length === 0 && (
          <div className="text-zinc-600 text-xs mt-auto mb-2 select-none">drop</div>
        )}
      </div>

      <span className="text-zinc-500 text-xs font-mono">{index + 1}</span>
    </div>
  );
}