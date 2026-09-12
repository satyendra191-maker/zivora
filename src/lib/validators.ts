export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function text(value: unknown, max = 500, required = true) {
  const result = typeof value === 'string' ? value.trim() : '';
  if ((required && !result) || result.length > max) throw new ApiError(`Please enter valid text (up to ${max} characters).`);
  return result;
}

export function num(value: unknown, min: number, max: number) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new ApiError(`Please enter a number from ${min} to ${max}.`);
  return n;
}

export function rangeDays(value: unknown, fallback = 30, max = 365) {
  if (value === undefined || value === null || value === '') return fallback;
  return num(value, 1, max);
}

const leadStatuses = ['new', 'contacted', 'converted', 'closed'];
export function leadStatus(value: unknown) {
  if (typeof value !== 'string' || !leadStatuses.includes(value)) throw new ApiError('Choose a valid lead status.');
  return value;
}
