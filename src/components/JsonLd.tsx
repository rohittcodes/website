// Drop-in replacement for @once-ui-system/core's <Schema>, same prop shape,
// but a plain server-rendered <script> instead of next/script. next/script's
// default "afterInteractive" strategy only injects the real tag client-side
// after hydration, so it's invisible to crawlers that don't execute JS
// (https://nextjs.org/docs/app/guides/json-ld recommends this pattern instead).
type SchemaAuthor = {
  name: string;
  url?: string;
  image?: string;
};

interface SchemaProps {
  as: "website" | "article" | "blogPosting" | "techArticle" | "webPage" | "organization";
  title: string;
  description?: string;
  baseURL: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  sameAs?: string[];
  author?: SchemaAuthor;
}

const SCHEMA_TYPE_MAP: Record<SchemaProps["as"], string> = {
  website: "WebSite",
  article: "Article",
  blogPosting: "BlogPosting",
  techArticle: "TechArticle",
  webPage: "WebPage",
  organization: "Organization",
};

export function Schema({
  as,
  title,
  description,
  baseURL,
  path,
  datePublished,
  dateModified,
  image,
  sameAs = [],
  author,
}: SchemaProps) {
  const normalizedBaseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const imageUrl = image
    ? `${normalizedBaseURL}${image.startsWith("/") ? image : `/${image}`}`
    : undefined;
  const url = `${normalizedBaseURL}${normalizedPath}`;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE_MAP[as],
    url,
    sameAs: sameAs.filter(Boolean),
  };

  if (as === "website" || as === "organization") {
    schema.name = title;
    schema.description = description;
    schema.image = imageUrl;
  } else {
    schema.headline = title;
    schema.description = description;
    schema.image = imageUrl;
    if (datePublished) {
      schema.datePublished = datePublished;
      schema.dateModified = dateModified || datePublished;
    }
  }

  if (author) {
    schema.author = {
      "@type": "Person",
      name: author.name,
      ...(author.url && { url: author.url }),
      ...(author.image && { image: { "@type": "ImageObject", url: author.image } }),
    };
  }

  return (
    <script
      id={`schema-${as}-${path}`}
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON.stringify output, not user input
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function JsonLd({ id, data }: { id: string; data: Record<string, unknown> }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON.stringify output, not user input
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
