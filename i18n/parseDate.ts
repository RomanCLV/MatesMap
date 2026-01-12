export const parseDate = (input: Date | string | number): Date | null => {
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;

  if (typeof input === "number") {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof input !== "string") return null;

  // ISO YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(input)) {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }

  // Formats français & courants : DD/MM/YYYY ou D/M/YYYY
  if (/^\d{1,2}[\/-]\d{1,2}[\/-]\d{4}$/.test(input)) {
    const [day, month, year] = input.split(/[\/-]/).map(Number);
    const d = new Date(year, month - 1, day);
    return d.getDate() === day && d.getMonth() === month - 1 ? d : null;
  }

  return null;
};
