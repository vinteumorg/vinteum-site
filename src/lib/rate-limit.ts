// Fixed-window counter held in process memory. The site runs as a single Node
// process on the production VM, so a module-level Map is enough to stop a script
// from hammering a public endpoint; it is not shared across instances and it
// resets on restart, which is acceptable for abuse damping (not for quota).
type Hits = number[];

const buckets = new Map<string, Hits>();
const MAX_KEYS = 5000;

/**
 * Records a hit for `key` and reports whether it is still inside `limit`
 * events per `windowMs`.
 */
export function allowHit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const hits = (buckets.get(key) ?? []).filter((at) => now - at < windowMs);

    if (hits.length >= limit) {
        buckets.set(key, hits);
        return false;
    }

    hits.push(now);
    buckets.set(key, hits);

    // Bound memory: drop keys whose window has fully expired.
    if (buckets.size > MAX_KEYS) {
        for (const [k, v] of buckets) {
            if (v.every((at) => now - at >= windowMs)) buckets.delete(k);
        }
    }

    return true;
}

// Exposed for tests.
export function resetRateLimit(): void {
    buckets.clear();
}
