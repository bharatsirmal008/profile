/** Short-lived in-memory cache for public portfolio data; never for private records. */
export function createResourceCache<T>(ttl: number, now = Date.now) {
  const values = new Map<string, { value: T; expires: number }>();
  const pending = new Map<string, Promise<T>>();
  let generation = 0;
  const peek = (key: string): T | undefined => {
    const item = values.get(key);
    if (!item || item.expires <= now()) { values.delete(key); return undefined; }
    return item.value;
  };
  return {
    peek,
    read(key: string, load: () => Promise<T>): Promise<T> {
      const value = peek(key);
      if (value !== undefined) return Promise.resolve(value);
      const flight = pending.get(key);
      if (flight) return flight;
      const version = generation;
      const request = Promise.resolve().then(load).then(result => {
        if (version === generation) values.set(key, { value: result, expires: now() + ttl });
        return result;
      }).finally(() => { if (pending.get(key) === request) pending.delete(key); });
      pending.set(key, request);
      return request;
    },
    clear() { generation++; values.clear(); pending.clear(); },
  };
}
