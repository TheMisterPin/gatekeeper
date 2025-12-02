
// "use client";

// import React, { useRef, useState } from "react";
// import { useErrorDialog } from "@/hooks/ErrorDialogContext";

// export interface AppointmentsCsvControlsProps {
//   /** Date used for export filter, e.g. "2025-11-25" */
//   date: string;
//   /** Called after a successful import so the parent can refresh data */
//   onImportComplete?: () => void;
// }

// /**
//  * Small toolbar component that exposes:
//  * - "Esporta Excel" (actually CSV compatible with Excel)
//  * - "Importa Excel" (CSV upload)
//  *
//  * It talks to:
//  * - GET /api/appointments/export?date=YYYY-MM-DD
//  * - POST /api/appointments/import (multipart/form-data, field "file")
//  */
// const AppointmentsCsvControls: React.FC<AppointmentsCsvControlsProps> = ({
//   date,
//   onImportComplete,
// }) => {
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const [importing, setImporting] = useState(false);
//   const { reportError } = useErrorDialog();

//   const handleExport = () => {
//     const url = `/api/appointments/export?date=${encodeURIComponent(date)}`;
//     // simplest: navigate to URL and let browser download
//     window.location.href = url;
//   };

//   const handleImportClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
//     event
//   ) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

    setImporting(true);
    try:
      const formData = new FormData();
      formData.append("file", file);

//       const res = await fetch("/api/appointments/import", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const payload = await res.json().catch(() => null);
//         const message =
//           payload?.error ?? `Import fallito (HTTP ${res.status})`;
//         reportError(message, {
//           source: "appointments/import",
//           title: "Errore durante l'import",
//           details: typeof payload === "string" ? payload : undefined,
//         });
//         return;
//       }

//       const payload = await res.json();
//       const imported = payload?.imported ?? 0;
//       const skipped = payload?.skipped ?? 0;
//       reportError(
//         `Import completato. Importati: ${imported}. Saltati: ${skipped}.`,
//         {
//           severity: "info",
//           source: "appointments/import",
//           title: "Import completato",
//         }
//       );
//       onImportComplete?.();
//     } catch (err) {
//       console.error("Import error", err);
//       reportError(err, {
//         source: "appointments/import",
//         title: "Errore durante l'import da Excel/CSV",
//       });
//     } finally {
//       setImporting(false);
//       event.target.value = "";
//     }
//   };

//   return (
//     <div className="flex items-center gap-2">
//       <button
//         type="button"
//         onClick={handleExport}
//         className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
//       >
//         Esporta Excel
//       </button>
//       <button
//         type="button"
//         onClick={handleImportClick}
//         disabled={importing}
//         className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
//       >
//         {importing ? "Import in corso..." : "Importa Excel"}
//       </button>
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept=".csv, text/csv"
//         className="hidden"
//         onChange={handleFileChange}
//       />
//     </div>
//   );
// };

// export default AppointmentsCsvControls;
