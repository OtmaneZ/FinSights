/**
 * StructuredData Component
 * Renders JSON-LD structured data for SEO
 */

interface StructuredDataProps {
    data: object
}

/**
 * Safely serializes JSON-LD data, escaping characters that could break
 * HTML parsing when injected in a <script> tag (e.g. </script>, <!, --).
 */
function safeJsonLd(data: object): string {
    return JSON.stringify(data)
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029')
}

export default function StructuredData({ data }: StructuredDataProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
        />
    )
}
