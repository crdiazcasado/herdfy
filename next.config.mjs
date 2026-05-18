import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'herdfy.vercel.app' }],
        destination: 'https://www.herdfy.com/:path*',
        permanent: true
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'herdfy.vercel.app' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }]
      }
    ]
  }
}

export default withNextIntl(nextConfig)
