export interface Month {
  firstDay: Date;
  lastDay: Date;
}

export function getCurrentMonth(): Month {

  const date = new Date(), y = date.getFullYear(), m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  return {
    firstDay: firstDay,
    lastDay: lastDay
  }
}

export function getLastMonth(): Month {

  const date = new Date(), y = date.getFullYear(), m = date.getMonth();
  const firstDay = m === 1 ? new Date(y - 1, 12, 1) : new Date(y, m - 1, 1);
  const lastDay = new Date(y, m, 0);

  return {
    firstDay: firstDay,
    lastDay: lastDay
  }
}

export function getMonarchDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}