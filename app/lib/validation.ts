import { toLocalDateString } from "./date-utils";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ID_PATTERN = /^[1-9]\d*$/;

export function validateInt(id: string): number | null {
  return ID_PATTERN.test(id) ? Number(id) : null;
}

export function validateDate(value: string): string | null {
  if (!DATE_PATTERN.test(value)) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  const parsedDate = new Date(0);

  parsedDate.setHours(0, 0, 0, 0);
  parsedDate.setFullYear(year, month - 1, day);

  return toLocalDateString(parsedDate) === value ? value : null;
}