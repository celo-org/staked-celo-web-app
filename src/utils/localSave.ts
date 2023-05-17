export const writeToCache = (url: string, data: string[]) =>
  localStorage.setItem(url, JSON.stringify({ ts: Date.now(), data }));

export const readFromCache = (url: string) => {
  const cached = localStorage.getItem(url);
  if (cached) {
    return JSON.parse(cached) as { ts: number; data: string[] };
  }
  return null;
};
