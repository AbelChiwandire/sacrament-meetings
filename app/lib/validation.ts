const ID_PATTERN = /^[1-9]\d*$/;

export function validateInt(id: string): number | null {
  return ID_PATTERN.test(id) ? Number(id) : null;
}