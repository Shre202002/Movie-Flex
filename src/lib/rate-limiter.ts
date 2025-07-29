import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

const ipStore: Map<string, {count: number; expiry: number}> = new Map();

const windowMs = 1 * 60 * 1000; // 1 minute
const limit = 100; // Limit each IP to 100 requests per window

export function getLimiter() {
  return {
    check: (request: NextRequest) => {
      const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';
      const now = Date.now();

      const record = ipStore.get(ip);

      if (!record || record.expiry < now) {
        ipStore.set(ip, {
          count: 1,
          expiry: now + windowMs,
        });
        return true;
      }

      if (record.count < limit) {
        record.count++;
        return true;
      }

      return false;
    },
  };
}
