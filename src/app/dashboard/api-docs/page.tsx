/**
 * API Documentation Page
 * Interactive Swagger UI for FinSight REST API v1
 */

'use client';

import { useEffect, useState } from 'react';
import { Copy, Check, ExternalLink, Key, Book } from 'lucide-react';

export default function ApiDocsPage() {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'endpoints' | 'examples'>('overview');

    const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : 'https://finsight.app';

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Book className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            FinSight API v1
                        </h1>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Access your financial dashboards and KPIs programmatically
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'overview'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('endpoints')}
                            className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'endpoints'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                }`}
                        >
                            Endpoints
                        </button>
                        <button
                            onClick={() => setActiveTab('examples')}
                            className={`py-4 border-b-2 font-medium transition-colors ${activeTab === 'examples'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                }`}
                        >
                            Examples
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Authentication */}
                        <section className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Key className="w-6 h-6 text-blue-600" />
                                Authentication
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                All API requests require authentication using an API key in the Authorization header:
                            </p>
                            <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 relative">
                                <pre className="text-green-400 font-mono text-sm">
                                    Authorization: Bearer fsk_live_your_api_key_here
                                </pre>
                                <button
                                    onClick={() => copyToClipboard('Authorization: Bearer fsk_live_your_api_key_here')}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <a
                                href="/dashboard/api-keys"
                                className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Generate API Key
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </section>

                        {/* Base URL */}
                        <section className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                Base URL
                            </h2>
                            <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4">
                                <pre className="text-blue-400 font-mono text-sm">
                                    {baseUrl}/api/v1
                                </pre>
                            </div>
                        </section>

                        {/* Rate Limits */}
                        <section className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                Rate Limits
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">PRO Plan</div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">1,000</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">requests/day</div>
                                </div>
                                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">SCALE Plan</div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">10,000</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">requests/day</div>
                                </div>
                                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">ENTERPRISE Plan</div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">Unlimited</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">requests</div>
                                </div>
                            </div>
                        </section>

                        {/* Response Format */}
                        <section className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                Response Format
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                All successful responses follow this structure:
                            </p>
                            <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4">
                                <pre className="text-sm font-mono text-slate-300">
                                    {`{
  "success": true,
  "data": { ... },
  "meta": { ... },
  "timestamp": "2025-11-28T10:00:00.000Z"
}`}
                                </pre>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'endpoints' && (
                    <div className="space-y-8">
                        {/* GET /dashboards */}
                        <section className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-mono text-sm font-bold">
                                    GET
                                </span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                                    /dashboards
                                </h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                List dashboards with pagination and filtering
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Query Parameters</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex gap-2">
                                            <code className="text-blue-600 dark:text-blue-400">page</code>
                                            <span className="text-slate-600 dark:text-slate-400">- Page number (default: 1)</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <code className="text-blue-600 dark:text-blue-400">limit</code>
                                            <span className="text-slate-600 dark:text-slate-400">- Items per page (default: 10, max: 100)</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <code className="text-blue-600 dark:text-blue-400">companyId</code>
                                            <span className="text-slate-600 dark:text-slate-400">- Filter by company</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <code className="text-blue-600 dark:text-blue-400">sortBy</code>
                                            <span className="text-slate-600 dark:text-slate-400">- Sort field (createdAt, updatedAt, fileName)</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <code className="text-blue-600 dark:text-blue-400">sortOrder</code>
                                            <span className="text-slate-600 dark:text-slate-400">- Sort direction (asc, desc)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* GET /dashboards/:id */}
                        <section className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-mono text-sm font-bold">
                                    GET
                                </span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                                    /dashboards/:id
                                </h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Get specific dashboard with full data
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Query Parameters</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex gap-2">
                                            <code className="text-blue-600 dark:text-blue-400">includeRawData</code>
                                            <span className="text-slate-600 dark:text-slate-400">- Include raw transaction data (default: false)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* GET /kpis */}
                        <section className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-mono text-sm font-bold">
                                    GET
                                </span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                                    /kpis
                                </h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Get aggregated or specific KPIs
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Query Parameters</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex gap-2">
                                            <code className="text-blue-600 dark:text-blue-400">companyId</code>
                                            <span className="text-slate-600 dark:text-slate-400">- Filter by company</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <code className="text-blue-600 dark:text-blue-400">dashboardId</code>
                                            <span className="text-slate-600 dark:text-slate-400">- Get KPIs for specific dashboard</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <code className="text-blue-600 dark:text-blue-400">metrics</code>
                                            <span className="text-slate-600 dark:text-slate-400">- Comma-separated metrics (revenue,margin,cashflow,dso,bfr or "all")</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'examples' && (
                    <div className="space-y-8">
                        {/* cURL Examples */}
                        <section className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                cURL Examples
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                                        List Dashboards
                                    </h3>
                                    <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 relative">
                                        <pre className="text-slate-300 font-mono text-xs overflow-x-auto">
                                            {`curl -X GET "${baseUrl}/api/v1/dashboards?page=1&limit=10" \\
  -H "Authorization: Bearer fsk_live_your_api_key_here"`}
                                        </pre>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                                        Get Specific Dashboard
                                    </h3>
                                    <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 relative">
                                        <pre className="text-slate-300 font-mono text-xs overflow-x-auto">
                                            {`curl -X GET "${baseUrl}/api/v1/dashboards/cly123abc?includeRawData=true" \\
  -H "Authorization: Bearer fsk_live_your_api_key_here"`}
                                        </pre>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                                        Get KPIs
                                    </h3>
                                    <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 relative">
                                        <pre className="text-slate-300 font-mono text-xs overflow-x-auto">
                                            {`curl -X GET "${baseUrl}/api/v1/kpis?metrics=revenue,margin,cashflow" \\
  -H "Authorization: Bearer fsk_live_your_api_key_here"`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* JavaScript Examples */}
                        <section className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                JavaScript Examples
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                                        Fetch Dashboards
                                    </h3>
                                    <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 relative">
                                        <pre className="text-slate-300 font-mono text-xs overflow-x-auto">
                                            {`const response = await fetch('${baseUrl}/api/v1/dashboards', {
  headers: {
    'Authorization': 'Bearer fsk_live_your_api_key_here'
  }
});
const data = await response.json();
console.log(data.data); // Array of dashboards`}
                                        </pre>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                                        Fetch KPIs
                                    </h3>
                                    <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 relative">
                                        <pre className="text-slate-300 font-mono text-xs overflow-x-auto">
                                            {`const response = await fetch('${baseUrl}/api/v1/kpis?metrics=all', {
  headers: {
    'Authorization': 'Bearer fsk_live_your_api_key_here'
  }
});
const data = await response.json();
console.log(data.data.metrics); // KPIs object`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
