/**
 * Emits a JSON-LD block. Content is produced by the typed builders in lib/schema-org.ts,
 * never by string concatenation at the call site.
 */
export function JsonLd({ json }: { json: string }) {
  return (
    <script
      type="application/ld+json"
      // Content is JSON.stringify output from our own typed builders — no user input.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }}
    />
  );
}
