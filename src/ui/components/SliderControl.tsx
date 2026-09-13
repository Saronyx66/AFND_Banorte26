"use client";

import { useEffect, useRef, useState } from "react";
import { useA2UINode } from "../useA2UINode";
import type { A2UIComponentProps } from "../types";

function formatearValor(valor: number, format?: string): string {
  if (format === "currency") return `$${valor.toLocaleString("es-MX")} MN`;
  if (format === "percent") return `${valor} %`;
  return String(valor);
}

export function SliderControl({ node, onEvento }: A2UIComponentProps) {
  console.debug("render", node.id);
  const { label, min, max, step, value, format, action, debounceMs } = useA2UINode(node) as {
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    format?: string;
    action?: string;
    debounceMs?: number;
  };

  const [local, setLocal] = useState<number>(typeof value === "number" ? value : min ?? 0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof value === "number") setLocal(value);
  }, [value]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nuevo = Number(e.target.value);
    setLocal(nuevo);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (action) onEvento(node.id, action, { valor: nuevo });
    }, debounceMs ?? 200);
  }

  const lo = min ?? 0;
  const hi = max ?? 100;
  // D30: porcentaje recorrido para pintar el relleno de la pista (solo presentación).
  const pct = hi > lo ? Math.min(100, Math.max(0, ((local - lo) / (hi - lo)) * 100)) : 0;

  return (
    <div className="a2ui-card a2ui-slider">
      <label htmlFor={node.id}>
        <span>{label}</span>
        <strong className="a2ui-slider-valor">{formatearValor(local, format)}</strong>
      </label>
      <input
        id={node.id}
        type="range"
        min={lo}
        max={hi}
        step={step ?? 1}
        value={local}
        onChange={onChange}
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />
      <div className="a2ui-slider-extremos" aria-hidden="true">
        <span>{formatearValor(lo, format)}</span>
        <span>{formatearValor(hi, format)}</span>
      </div>
    </div>
  );
}
