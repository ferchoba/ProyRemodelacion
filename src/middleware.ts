import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match internationalized pathnames and routes without locale prefix
  matcher: ['/', '/(es|en)/:path*', '/((?!_next|api|.*\\..*).*)']
};
