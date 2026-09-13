"use client";

import { useEffect, useRef, useState } from "react";

// Tarjeta digital: función del shell, NO del catálogo A2UI (D31). El agente
// no la controla y nada de esto pasa por el router ni por la voz (D22).
// Datos de demo fijos, igual que "Buen día, Sofía" del header: la base solo
// guarda la terminación ('4321', db/seed.sql). Número ficticio.
const TARJETA_DEMO = {
  titular: "Sofía Torres",
  numero: "5310 4821 7736 4321",
  vigencia: "09/29",
  cvv: "417",
};

const SEGUNDOS_VISIBLE = 15; // los datos se vuelven a ocultar solos

function enmascarar(numero: string): string {
  const grupos = numero.split(" ");
  return grupos.map((g, i) => (i === grupos.length - 1 ? g : "••••")).join(" ");
}

interface Props {
  abierta: boolean;
  onCerrar: () => void;
}

export function TarjetaDigital({ abierta, onCerrar }: Props) {
  const [revelado, setRevelado] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const cerrarRef = useRef<HTMLButtonElement>(null);

  // Al abrir: foco en "Cerrar" y datos ocultos. Al cerrar: todo ocultos otra vez.
  useEffect(() => {
    if (!abierta) {
      setRevelado(false);
      setCopiado(false);
      return;
    }
    cerrarRef.current?.focus();
    function onTecla(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
    }
    document.addEventListener("keydown", onTecla);
    return () => document.removeEventListener("keydown", onTecla);
  }, [abierta, onCerrar]);

  // Revelado con caducidad: a los 15 s se vuelve a enmascarar solo.
  useEffect(() => {
    if (!revelado) return;
    const t = setTimeout(() => setRevelado(false), SEGUNDOS_VISIBLE * 1000);
    return () => clearTimeout(t);
  }, [revelado]);

  async function copiarNumero() {
    try {
      await navigator.clipboard.writeText(TARJETA_DEMO.numero.replace(/\s/g, ""));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  }

  if (!abierta) return null;

  const numero = revelado ? TARJETA_DEMO.numero : enmascarar(TARJETA_DEMO.numero);
  const vigencia = revelado ? TARJETA_DEMO.vigencia : "••/••";
  const cvv = revelado ? TARJETA_DEMO.cvv : "•••";

  return (
    <div className="a2ui-modal-overlay" onClick={onCerrar}>
      <div
        className="a2ui-card a2ui-modal tarjeta-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tarjeta-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tarjeta-cabecera">
          <h3 id="tarjeta-titulo">Mi tarjeta</h3>
          <button type="button" className="tarjeta-cerrar" onClick={onCerrar} aria-label="Cerrar" ref={cerrarRef}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className={`tarjeta${revelado ? " tarjeta--revelada" : ""}`} aria-live="polite">
          <div className="tarjeta-fila">
            <img className="tarjeta-logo" src="/logo-banorte.svg" alt="Banorte" />
            <span className="tarjeta-tipo">Crédito</span>
          </div>
          <svg className="tarjeta-chip" viewBox="0 0 40 30" aria-hidden="true" focusable="false">
            <rect x="1" y="1" width="38" height="28" rx="5" fill="currentColor" opacity="0.9" />
            <path d="M1 11h12v8H1M27 11h12v8H27M13 1v28M27 1v28M13 15h14" fill="none" stroke="#b3001b" strokeWidth="1.5" />
          </svg>
          <div className="tarjeta-numero" aria-label={revelado ? `Número ${TARJETA_DEMO.numero}` : "Número oculto, termina en 4321"}>
            {numero}
          </div>
          <div className="tarjeta-pie">
            <div className="tarjeta-dato">
              <span className="tarjeta-etiqueta">Titular</span>
              <span className="tarjeta-valor">{TARJETA_DEMO.titular}</span>
            </div>
            <div className="tarjeta-dato">
              <span className="tarjeta-etiqueta">Vigencia</span>
              <span className="tarjeta-valor tarjeta-valor--num">{vigencia}</span>
            </div>
            <div className="tarjeta-dato">
              <span className="tarjeta-etiqueta">CVV</span>
              <span className="tarjeta-valor tarjeta-valor--num">{cvv}</span>
            </div>
          </div>
        </div>

        <p className="tarjeta-nota">
          {revelado ? `Se ocultan solos en ${SEGUNDOS_VISIBLE} segundos.` : "Tus datos están ocultos. Muéstralos solo cuando nadie más vea la pantalla."}
        </p>

        <div className="a2ui-modal-acciones">
          <button type="button" className="a2ui-boton-secundario" onClick={copiarNumero} disabled={!revelado}>
            {copiado ? "Copiado" : "Copiar número"}
          </button>
          <button type="button" className="a2ui-boton-primario" onClick={() => setRevelado((r) => !r)} aria-pressed={revelado}>
            {revelado ? "Ocultar datos" : "Mostrar datos"}
          </button>
        </div>
      </div>
    </div>
  );
}
