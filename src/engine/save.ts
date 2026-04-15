const saveKey = "huhai-save";

export function writeSave(data: unknown): void {
  localStorage.setItem(saveKey, JSON.stringify(data));
}

export function readSave<T>(): T | null {
  const raw = localStorage.getItem(saveKey);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function clearSave(): void {
  localStorage.removeItem(saveKey);
}
