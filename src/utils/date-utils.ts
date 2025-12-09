import { date } from "zod/v3";

const TODAY = new Date().toISOString().slice(0, 10); 
export function formatTodayLabel(): string {
  const [year, month, day] = TODAY.split("-");
  return `${day}/${month}/${year}`;
}
export function safeDateToIso(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const date = value instanceof Date ? value : new Date(value as string);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}


 export const  parseDate = (date: Date) => new Intl.DateTimeFormat('it-IT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);

    export const parseTime = (time: Date) => new Intl.DateTimeFormat('it-IT', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(time);