import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const OLD_DOMAIN = 'ais-dev-qnarmag6xx4dn7nojdcvle-531890418709.europe-west2.run.app';
const NEW_DOMAIN = 'lojatiktok.vercel.app';

export function middleware(request: NextRequest) {
    const { hostname, pathname, search } = request.nextUrl;

    // Redirect any requests from the old domain to the new domain
    if (hostname === OLD_DOMAIN) {
        const newUrl = new URL(`https://${NEW_DOMAIN}${pathname}${search}`);
        return NextResponse.redirect(newUrl, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
