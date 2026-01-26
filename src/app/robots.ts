import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/dashboard/',
          '/dashboard-v1/',
          '/_next/',
          '/admin/'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/auth/', '/dashboard/', '/dashboard-v1/'],
      }
    ],
    sitemap: 'https://getfinsight.fr/sitemap.xml',
  }
}
