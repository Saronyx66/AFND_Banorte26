"use client";

import { useA2UINode } from "../useA2UINode";
import type { A2UIComponentProps } from "../types";

interface Chip {
  label: string;
  prompt: string;
}

export function SuggestionChips({ node, onEvento }: A2UIComponentProps) {
  console.debug("render", node.id);
  const { items } = useA2UINode(node) as { items?: Chip[] };

  return (
    <div className="a2ui-chips">
      {(items ?? []).map((chip, i) => (
        <button
          key={i}
          type="button"
          className="a2ui-chip"
          onClick={() => onEvento(node.id, "mensaje_libre", { texto: chip.prompt })}
        >
          <span className="a2ui-chip-icono" aria-hidden="true">
            {/* D30: icono SVG en vez de emoji; el emoji cambiaba de forma por sistema. */}
            <svg viewBox="0 0 24 24" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.2-4.2A8 8 0 1 1 21 12z" />
              <path d="M8 12h.01M12 12h.01M16 12h.01" />
            </svg>
          </span>
          <span className="a2ui-chip-label">{chip.label}</span>
        </button>
      ))}
    </div>
  );
}
