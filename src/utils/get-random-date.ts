// utils/getRandomDate.ts

/**
 * Ritorna un Date random tra start e end,
 * limitato a lun-ven e tra le 08:00 e le 18:00.
 */
export function getRandomDate(
  start: Date,
  end: Date
): Date {
  if (end.getTime() <= start.getTime()) {
    throw new Error("end deve essere maggiore di start");
  }

  // loop finché non troviamo un giorno feriale
  while (true) {
    const ts =
      start.getTime() +
      Math.random() * (end.getTime() - start.getTime());

    const d = new Date(ts);
    const day = d.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat

    // salta weekend
    if (day === 0 || day === 6) {
      continue;
    }

    // ora random tra 8:00 e 17:59:59
    const hour = 8 + Math.floor(Math.random() * 10); // 8..17
    const minute = Math.floor(Math.random() * 60);   // 0..59
    const second = Math.floor(Math.random() * 60);   // 0..59

    d.setHours(hour, minute, second, 0);
    return d;
  }
}

/**
 * Formatta un Date come datetime2(0) SQL: 'YYYY-MM-DD HH:MM:SS'
 * ATTENZIONE: usa l'ora locale della macchina Node.
 */
export function toSqlDateTime2(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // 0-based
  const day = pad(date.getDate());

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}