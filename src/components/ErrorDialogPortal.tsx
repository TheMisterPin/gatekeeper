
"use client";

import React, { useMemo, useState } from "react";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useErrorDialog } from "../hooks/ErrorDialogContext";

const SEVERITY_THEME = {
  error: {
    label: "Errore",
    headerBg: "bg-red-600",
    headerText: "text-white",
    accent: "text-red-700",
    icon: AlertCircle,
  },
  warning: {
    label: "Attenzione",
    headerBg: "bg-amber-500",
    headerText: "text-slate-950",
    accent: "text-amber-700",
    icon: AlertTriangle,
  },
  info: {
    label: "Informazione",
    headerBg: "bg-sky-500",
    headerText: "text-white",
    accent: "text-sky-700",
    icon: Info,
  },
} as const;

const ErrorDialogPortal: React.FC = () => {
  const { isOpen, currentError, clearError } = useErrorDialog();
  const [showDetails, setShowDetails] = useState(false);

  const theme = useMemo(() => {
    if (!currentError) return null;
    return SEVERITY_THEME[currentError.severity] ?? SEVERITY_THEME.error;
  }, [currentError]);

  if (!isOpen || !currentError || !theme) return null;

  const Icon = theme.icon;
  const timestamp = new Date(currentError.timestamp).toLocaleString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="app-error-title"
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className={`flex items-center justify-center gap-3 px-6 py-4 ${theme.headerBg} ${theme.headerText}`}>
          <Icon className="h-5 w-5" aria-hidden />
          <p className="text-sm font-semibold uppercase tracking-[0.3em]">
            {theme.label}
          </p>
          <Icon className="h-5 w-5" aria-hidden />
        </div>

        <div className="space-y-3 px-6 py-5 text-slate-900">
          <div>
            <h2 id="app-error-title" className="text-base font-semibold">
              {currentError.title}
            </h2>
            <p className="text-sm text-slate-500">
              {currentError.source ? `${currentError.source} · ${timestamp}` : timestamp}
            </p>
          </div>

          <p className="rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-800 whitespace-pre-line">
            {currentError.message}
          </p>

          {currentError.details && (
            <div className="rounded-md border border-dashed border-slate-200 px-4 py-3">
              <button
                type="button"
                onClick={() => setShowDetails((value) => !value)}
                className={`text-xs font-semibold ${theme.accent}`}
              >
                {showDetails ? "Nascondi dettagli tecnici" : "Mostra dettagli tecnici"}
              </button>
              {showDetails && (
                <pre className="mt-2 max-h-48 overflow-auto text-xs text-slate-600">
                  {currentError.details}
                </pre>
              )}
            </div>
          )}
        </div>

        <div className="bg-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={clearError}
            className="w-full rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialogPortal;
