
"use client";

import React, { useEffect, useState } from "react";
import CurrentVisitorsView, { CurrentVisit } from "./CurrentVisitorsView";
import AppointmentsCsvControls from "./AppointmentsCsvControls";

interface CurrentVisitsResponse {
  visits: {
    id: number;
    appointmentId: string;
    visitorName: string;
    hostName: string;
    location?: string | null;
    checkInTime: string;
    checkOutTime?: string | null;
  }[];
}

/**
 * Demo page that:
 * - fetches /api/visits/current
 * - shows them using CurrentVisitorsView
 * - exposes the Excel/CSV export/import controls for appointments
 *
 * In a real app you'd embed these pieces inside your main dashboard.
 */
const CurrentInsideDemoPage: React.FC = () => {
  const [visits, setVisits] = useState<CurrentVisit[]>([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const loadVisits = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/visits/current");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload: CurrentVisitsResponse = await res.json();
      const mapped: CurrentVisit[] = payload.visits.map((v) => ({
        id: v.id,
        visitorName: v.visitorName,
        hostName: v.hostName,
        location: v.location,
        checkInTime: v.checkInTime,
      }));
      setVisits(mapped);
    } catch (err) {
      console.error("Failed to load current visits", err);
      alert("Impossibile caricare l'elenco dei visitatori presenti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadVisits();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Dashboard visitatori
            </h1>
            <p className="text-xs text-slate-500">
              Data odierna: {today}
            </p>
          </div>
          <AppointmentsCsvControls
            date={today}
            onImportComplete={loadVisits}
          />
        </div>

        <CurrentVisitorsView
          visits={visits}
          loading={loading}
          onRefresh={loadVisits}
        />
      </div>
    </div>
  );
};

export default CurrentInsideDemoPage;
