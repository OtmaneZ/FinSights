const { withSentryConfig } = require('@sentry/nextjs');

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
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.clarity.ms",
                            "style-src 'self' 'unsafe-inline'",
                            "img-src 'self' data: https: blob:",
                            "font-src 'self' data:",
                            "connect-src 'self' https://api.openrouter.ai https://api.openai.com https://api.stripe.com https://*.upstash.io https://*.pinecone.io https://*.pusher.com wss://*.pusher.com https://app.posthog.com https://vitals.vercel-insights.com",
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

// Wrap with Sentry config for production monitoring
module.exports = withSentryConfig(
    withPWA(nextConfig),
    {
        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options

        // Suppresses source map uploading logs during build
        silent: true,
        org: "zineinsights-xy",
        project: "finsights",
    },
    {
        // For all available options, see:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

        // Upload a larger set of source maps for prettier stack traces (increases build time)
        widenClientFileUpload: true,

        // Transpiles SDK to be compatible with IE11 (increases bundle size)
        transpileClientSDK: false,

        // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers. (increases server load)
        tunnelRoute: "/monitoring",

        // Hides source maps from generated client bundles
        hideSourceMaps: true,

        // Automatically tree-shake Sentry logger statements to reduce bundle size
        disableLogger: true,

        // Enables automatic instrumentation of Vercel Cron Monitors.
        automaticVercelMonitors: true,
    }
);