type Props = {
  data: Record<string, unknown>;
};

/** Server-rendered JSON-LD script for search engines. */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
