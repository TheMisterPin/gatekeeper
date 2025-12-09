import { Appointment } from "@/types";
import { parseDate, parseTime } from "./date-utils";

export function exportAppointments(appointments: Appointment[]) {
    // Column headers
    const headers = ["Visitatore", "Azienda", "Risorsa", "Data", "Ora"];

    // Format data
    const rows = appointments.map(appointment => {
        const date = new Date(appointment.date);
        const startTime = new Date(appointment.startTime);

        const formattedDate = parseDate(date);
        const formattedTime = parseTime(startTime);

        return [
            appointment.visitorName,
            appointment.visitorCompany,
            appointment.hostName,
            formattedDate,
            formattedTime
        ];
    });

    // Create CSV content
    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'appointments.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}