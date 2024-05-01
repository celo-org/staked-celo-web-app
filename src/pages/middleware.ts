import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.info('GEO', request.geo);
  return NextResponse.next();
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/:path*',
};
