const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: false,
    },
    eslint: {
        // Allow production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: false,
    },
    // Fix: Skip API routes during static generation
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    // Performance optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'],
        } : false,
    },
    // Webpack optimizations
    webpack: (config, { isServer }) => {
        // Optimize bundle size
        if (!isServer) {
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        // Vendor chunk
                        vendor: {
                            name: 'vendor',
                            chunks: 'all',
                            test: /node_modules/,
                            priority: 20,
                        },
                        // D3.js separate chunk (heavy library)
                        d3: {
                            name: 'd3',
                            test: /[\\/]node_modules[\\/](d3|d3-.*)[\\/]/,
                            priority: 30,
                        },
                        // Recharts separate chunk
                        recharts: {
                            name: 'recharts',
                            test: /[\\/]node_modules[\\/]recharts[\\/]/,
                            priority: 30,
                        },
                        // Common components
                        common: {
                            name: 'common',
                            minChunks: 2,
                            priority: 10,
                            reuseExistingChunk: true,
                        },
                    },
                },
            };
        }
        return config;
    },
    // Disable static optimization for API routes
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'no-store, must-revalidate' },
                ],
            },
            // ✅ SÉCURITÉ : CSP Headers (protection XSS)
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com",
                            "style-src 'self' 'unsafe-inline'",
                            "img-src 'self' data: https:",
                            "font-src 'self' data:",
                            "connect-src 'self' https://api.openrouter.ai https://api.openai.com https://api.stripe.com",
                            "frame-src 'self' https://js.stripe.com",
                        ].join('; ')
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                ],
            },
        ];
    },
}

module.exports = withPWA(nextConfig)