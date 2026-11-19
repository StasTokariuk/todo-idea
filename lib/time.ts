import { uk } from '@/constants/uk';

export function formatRelativeTime(timestamp: string | number): string {
  const ms = typeof timestamp === 'number' ? timestamp : Date.parse(timestamp);
  if (Number.isNaN(ms)) return '';

  const delta = Date.now() - ms;
  const minutes = Math.floor(delta / 60000);

  if (minutes < 1) return uk.time.justNow;
  if (minutes < 60) return uk.time.minutesAgo(minutes);

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return uk.time.hoursAgo(hours);

  const days = Math.floor(hours / 24);
  if (days === 1) return uk.time.yesterday;
  if (days < 7) return uk.time.daysAgo(days);

  return new Date(ms).toLocaleDateString('uk-UA', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDeadline(deadline: string | null): string | null {
  if (!deadline) return null;
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return deadline;
  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function isOverdue(deadline: string | null): boolean {
  if (!deadline) return false;
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return false;
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end.getTime() < Date.now();
}

export function toDateInputValue(deadline: string | null): string {
  if (!deadline) return '';
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return deadline.slice(0, 10);
  return date.toISOString().slice(0, 10);
}
