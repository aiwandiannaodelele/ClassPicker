import type { MetadataRoute } from 'next'

export const dynamic = 'force-static';
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ClassPicker',
    short_name: 'ClassPicker',
    description: 'A simple and efficient random picker.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#F59E0B',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ],
  }
}
