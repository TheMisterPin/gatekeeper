
"use client";

import React from "react";
import { ErrorDialogProvider, useErrorDialog } from "@/hooks/ErrorDialogContext";
import ErrorDialogPortal from "./ErrorDialogPortal";

const ErrorDemoInner: React.FC = () => {
  const { reportError } = useErrorDialog();

  const triggerNetworkError = async () => {
    try {
      // Deliberately hitting a nonsense URL to generate an error
      const res = await fetch("/api/this-endpoint-does-not-exist");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      reportError(err, {
        source: "demo/network",
        title: "Errore di rete",
      });
    }
  };

  const triggerLogicError = () => {
    try {
      // ts-ignore: simulate some logic bug
      // @ts-ignore
      const x = (null as any).foo.bar;
      console.log(x);
    } catch (err) {
      reportError(err, {
        source: "demo/logic",
        title: "Errore interno",
      });
    }
  };

  const triggerCustomMessage = () => {
    reportError("Non siamo riusciti a caricare le prenotazioni di oggi.", {
      source: "appointments",
      severity: "warning",
      title: "Impossibile caricare gli appuntamenti",
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 p-4">
      <h1 className="text-xl font-semibold">Error dialog demo</h1>
      <p className="text-sm text-slate-600">
        Clicca uno dei pulsanti per generare un errore e aprire il dialog globale.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={triggerNetworkError}
          className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Simula errore di rete
        </button>
        <button
          type="button"
          onClick={triggerLogicError}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Simula bug logico
        </button>
        <button
          type="button"
          onClick={triggerCustomMessage}
          className="rounded bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          Messaggio custom
        </button>
      </div>
    </div>
  );
};

/**
 * Example "page" showing how to wire the provider + portal.
 * In a real app you'll put <ErrorDialogProvider> and <ErrorDialogPortal />
 * in your root layout and use `useErrorDialog()` from anywhere.
 */
const ErrorDemoPage: React.FC = () => {
  return (
    <ErrorDialogProvider>
      <ErrorDemoInner />
      <ErrorDialogPortal />
    </ErrorDialogProvider>
  );
};

export default ErrorDemoPage;
