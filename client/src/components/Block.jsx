import { blockColor } from "../utils/blockColors";

export default function Block({ letter, draggable, onDragStart, isBeingDragged }) {
  const { bg, text } = blockColor(letter);
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      title={draggable ? `Drag block ${letter}` : undefined}
      className={`
        flex items-center justify-center
        w-10 h-10 rounded
        font-bold text-base select-none shrink-0
        border border-black/20
        transition-opacity duration-150
        ${draggable ? "cursor-grab active:cursor-grabbing hover:brightness-110" : "cursor-default"}
        ${isBeingDragged ? "opacity-30" : "opacity-100"}
      `}
      style={{ background: bg, color: text, fontFamily: "'Georgia', serif" }}
    >
      {letter}
    </div>
  );
}