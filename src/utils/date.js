import { createFormatter } from 'next-intl';

export function formatDate(date, dateFormat, locale = 'en') {
  if (!date) {
    return '-';
  }
  if (isNaN(new Date(date).getTime())) {
    return 'Invalid date';
  }

  // Handle timezone issues by extracting just the date part
  let d;
  if (typeof date === 'string' && date.includes('T')) {
    // If it's an ISO string with time, extract just the date part
    const datePart = date.split('T')[0];
    d = new Date(datePart + 'T00:00:00.000Z'); // Force UTC to avoid timezone issues
  } else {
    d = new Date(date);
  }

  // If no dateFormat provided, always return YYYY-MM-DD
  if (!dateFormat) {
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  const format = createFormatter({ locale, timeZone: 'UTC' });
  return format.dateTime(
    d,
    dateFormat || {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
  );
}

export function formatMonthYear(isoMonth, locale = 'en-US') {
  if (!isoMonth) return '';

  const date = new Date(`${isoMonth}-01`);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString(locale, {
    month: 'short',
    year: 'numeric',
  });
}
// Next year's models reach the market in June, so the displayed model-year
// range rolls forward then (e.g. from June 2026 onwards it is 2026 - 2027).
const MODEL_YEAR_ROLLOVER_MONTH = 5; // June, zero-indexed

// Years are returned as strings so translations render them as plain years
// instead of formatted numbers (2,027).
export function getModelYears() {
  const now = new Date();
  const currentYear =
    now.getMonth() >= MODEL_YEAR_ROLLOVER_MONTH
      ? now.getFullYear() + 1
      : now.getFullYear();

  return {
    prevYear: String(currentYear - 1),
    currentYear: String(currentYear),
  };
}

export function getYearRange() {
  const { prevYear, currentYear } = getModelYears();
  return `${prevYear} - ${currentYear}`;
}

export function toSchemaOrgDate(date) {
  if (!date) return undefined;

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return undefined;

  return parsed.toISOString();
}
