
"use client";

import React, { useState } from "react";
import { useErrorDialog } from "../hooks/ErrorDialogContext";

/**
 * Very simple full-screen overlay that reads from ErrorDialogContext
 * and shows the current error. Purely presentational; replace with
 * your v0-generated dialog later if you want it prettier.
 */
const ErrorDialogPortal: React.FC = () => {
  const { isOpen, currentError, clearError } = useErrorDialog();
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen || !currentError) return null;

  const severityColor =
    currentError.severity === "error"
      ? "border-red-500 text-red-900"
      : currentError.severity === "warning"
      ? "border-amber-500 text-amber-900"
      : "border-sky-500 text-sky-900";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`mx-4 w-full max-w-lg rounded-lg border bg-white shadow-xl ${severityColor}`}>
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">
              {currentError.title}
            </h2>
            <p className="text-xs text-slate-500">
              {currentError.source
                ? `${currentError.source} · ${new Date(
                    currentError.timestamp
                  ).toLocaleTimeString()}`
                : new Date(currentError.timestamp).toLocaleTimeString()}
            </p>
          </div>
          <button
            type="button"
            onClick={clearError}
            className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
          >
            Chiudi
          </button>
        </div>
        <div className="px-4 py-3 text-sm text-slate-800">
          <p className="mb-2 whitespace-pre-wrap">{currentError.message}</p>
          {currentError.details && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowDetails((v) => !v)}
                className="text-xs text-slate-500 underline hover:text-slate-700"
              >
                {showDetails ? "Nascondi dettagli" : "Mostra dettagli"}
              </button>
              {showDetails && (
                <pre className="mt-2 max-h-40 overflow-auto rounded bg-slate-50 p-2 text-[11px] text-slate-600">
                  {currentError.details}
                </pre>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 border-t bg-slate-50 px-4 py-2">
          <button
            type="button"
            onClick={clearError}
            className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialogPortal;
