/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/pricing',
        destination: '/tarifs',
        permanent: true, // 301
      },
      {
        source: '/diagnostic',
        destination: '/diagnostic/guide',
        permanent: true, // 301
      },
      {
        source: '/daf-externalise-pme',
        destination: '/business-intelligence',
        permanent: true,
      },
      {
        source: '/blog/daf-externalise-pme-prix-2026',
        destination: '/business-intelligence',
        permanent: true,
      },
      {
        source: '/blog/fractional-cfo-france-guide-2026',
        destination: '/business-intelligence',
        permanent: true,
      },
      {
        source: '/blog/daf-externalise-vs-expert-comptable-confusion',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/a-partir-quel-ca-faut-il-un-daf',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/4-priorites-daf-90-jours',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/pme-b2b-6m-240k-cash-libere-4-mois',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
      '@agent': require('path').resolve(__dirname, 'agent-DAF'),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
