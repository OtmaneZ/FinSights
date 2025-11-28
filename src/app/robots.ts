import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/dashboard-v1/'],
    },
    sitemap: 'https://finsight.zineinsight.com/sitemap.xml',
  }
}
