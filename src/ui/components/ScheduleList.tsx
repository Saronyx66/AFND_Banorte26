"use client";

import { useA2UINode } from "../useA2UINode";
import type { A2UIComponentProps } from "../types";

interface ItemPago {
  fecha: string;
  monto: number;
  estado: string;
}

// D30: color del badge según el texto del estado. Solo presentación: el
// texto se muestra tal cual llega, el color es un refuerzo, nunca el único
// indicador.
function claseEstado(estado: string): string {
  const s = estado.toLowerCase();
  if (/(pagad|liquidad|aplicad|complet)/.test(s)) return "a2ui-estado a2ui-estado--bien";
  if (/(vencid|atrasad|retras|mora)/.test(s)) return "a2ui-estado a2ui-estado--alerta";
  return "a2ui-estado";
}

export function ScheduleList({ node }: A2UIComponentProps) {
  console.debug("render", node.id);
  const { items, emptyLabel } = useA2UINode(node) as {
    items?: ItemPago[];
    emptyLabel?: string;
  };
  const lista = items ?? [];

  return (
    <div className="a2ui-card a2ui-schedule">
      {lista.length === 0 ? (
        <p>{emptyLabel ?? "Sin pagos programados."}</p>
      ) : (
        <ul>
          {lista.map((it, i) => (
            <li key={i} className="a2ui-schedule-item">
              <span className="a2ui-schedule-fecha">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M3 10h18M8 3v4M16 3v4" />
                </svg>
                {it.fecha}
              </span>
              <span className="a2ui-schedule-monto">${it.monto.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MN</span>
              <span className={claseEstado(String(it.estado ?? ""))}>{it.estado}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
