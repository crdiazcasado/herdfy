// app/manifest.js
export default function manifest() {
  return {
    name: 'Herdfy',
    short_name: 'Herdfy',
    icons: [
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
    theme_color: '#3a9e7a',
    background_color: '#f8f7f4',
    display: 'standalone',
  }
}