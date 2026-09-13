"use client";

import { useState } from "react";

interface Props {
  disabled: boolean;
  onEnviar: (texto: string) => void;
}

export function TextInput({ disabled, onEnviar }: Props) {
  const [texto, setTexto] = useState("");

  function enviar() {
    const limpio = texto.trim();
    if (!limpio || disabled) return;
    onEnviar(limpio);
    setTexto("");
  }

  return (
    <div className="a2ui-textinput">
      <div className="a2ui-textinput-campo">
        <input
          type="text"
          value={texto}
          aria-label="Escribe tu pregunta"
          placeholder={disabled ? "Pixy está pensando…" : "Escribe tu pregunta…"}
          disabled={disabled}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") enviar();
          }}
        />
        <button type="button" disabled={disabled || !texto.trim()} onClick={enviar} aria-label="Enviar" title="Enviar">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
