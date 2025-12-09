
"use client";

import React from "react";

export interface CurrentVisit {
  id: number | string;
  visitorName: string;
  hostName: string;
  location?: string | null;
  checkInTime: string; // ISO string
}

export interface CurrentVisitorsViewProps {
  visits: CurrentVisit[];
  loading?: boolean;
  onRefresh?: () => void;
}

/**
 * Componente presentazionale che mostra chi è attualmente presente usando card simili alla lista appuntamenti.
 */
const CurrentVisitorsView: React.FC<CurrentVisitorsViewProps> = ({
  visits,
  loading = false,
  onRefresh,
}) => {
  const total = visits.length;

  const sorted = [...visits].sort((a, b) =>
    a.checkInTime.localeCompare(b.checkInTime)
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Visitatori attualmente all&apos;interno
          </h2>
          <p className="text-xs text-slate-500">
            Totale presenti:{" "}
            <span className="font-semibold text-slate-800">
              {total}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {loading && (
            <span className="text-xs text-slate-500">
              Aggiornamento in corso...
            </span>
          )}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Aggiorna
            </button>
          )}
        </div>
      </div>

      {total === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
          Nessun visitatore risulta presente al momento.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((v) => {
            const checkInDate = new Date(v.checkInTime);
            const timeLabel = isNaN(checkInDate.getTime())
              ? v.checkInTime
              : checkInDate.toLocaleTimeString("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

            return (
              <div
                key={v.id}
                className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {v.visitorName}
                    </h3>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                      Dentro
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    Ospite di{" "}
                    <span className="font-medium">{v.hostName}</span>
                  </p>
                  {v.location && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      Posizione: {v.location}
                    </p>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Ingresso: {timeLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CurrentVisitorsView;
