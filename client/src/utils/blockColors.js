export const PALETTE = [
  { bg: "#e05c3a", text: "#fff8f6" },
  { bg: "#3a8fe0", text: "#f0f7ff" },
  { bg: "#2ab07a", text: "#f0fff8" },
  { bg: "#c94f7c", text: "#fff0f6" },
  { bg: "#7c6ee0", text: "#f5f3ff" },
  { bg: "#d4900a", text: "#fffbf0" },
  { bg: "#5aab2a", text: "#f5fff0" },
  { bg: "#1db8b8", text: "#f0ffff" },
  { bg: "#8c8c8c", text: "#fafafa" },
  { bg: "#d94040", text: "#fff5f5" },
  { bg: "#5c3de0", text: "#f3f0ff" },
  { bg: "#0f7a5a", text: "#f0fff8" },
  { bg: "#b84020", text: "#fff8f5" },
  { bg: "#b03878", text: "#fff0f7" },
  { bg: "#3a7a20", text: "#f5fff0" },
  { bg: "#1a5fb0", text: "#f0f5ff" },
  { bg: "#a06010", text: "#fff8ee" },
  { bg: "#a02828", text: "#fff5f5" },
  { bg: "#0a4080", text: "#f0f7ff" },
  { bg: "#702860", text: "#fff0fb" },
  { bg: "#2a8a5a", text: "#f0fff8" },
  { bg: "#205090", text: "#f0f7ff" },
  { bg: "#8a4818", text: "#fff8f0" },
  { bg: "#6a1818", text: "#fff5f5" },
  { bg: "#0a3060", text: "#f0f7ff" },
  { bg: "#501848", text: "#fff0fb" },
];

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const blockColor = (letter) => PALETTE[ALPHABET.indexOf(letter)] ?? { bg: "#555", text: "#fff" };