import { type NextRequest, NextResponse } from 'next/server';
import { getLimiter } from '@/lib/rate-limiter';

const limiter = getLimiter();

export async function middleware(request: NextRequest) {
  const allowed = limiter.check(request);

  if (!allowed) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
