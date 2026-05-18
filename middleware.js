import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'

const intlMiddleware = createMiddleware(routing)

// Regions where Catalan is the primary language
const CATALAN_REGIONS = new Set(['CT', 'IB']) // Catalonia, Balearic Islands

function geoLocale(request) {
  const country = request.geo?.country
  const region = request.geo?.region
  if (country === 'AD') return 'ca'                          // Andorra
  if (country === 'ES' && CATALAN_REGIONS.has(region)) return 'ca'
  return null
}

export default function middleware(request) {
  const { pathname } = request.nextUrl

  // Only run geo detection when the user has no saved preference
  // and the URL has no explicit locale prefix yet
  const hasLocaleCookie = request.cookies.has('NEXT_LOCALE')
  const hasLocalePrefix = routing.locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )

  if (!hasLocaleCookie && !hasLocalePrefix) {
    const detected = geoLocale(request)
    if (detected === 'ca') {
      const url = request.nextUrl.clone()
      url.pathname = `/ca${pathname === '/' ? '' : pathname}`
      const response = NextResponse.redirect(url)
      response.cookies.set('NEXT_LOCALE', 'ca', {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
      })
      return response
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
