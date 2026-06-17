import { Meta } from "@once-ui-system/core";
import { baseURL } from "@/resources";

type MetaArgs = Parameters<typeof Meta.generate>[0];

export function generateSeoMetadata(props: MetaArgs) {
  const metadata = Meta.generate(props);
  const normalizedBase = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  const normalizedPath = props.path?.startsWith("/") ? props.path : `/${props.path || ""}`;
  const canonical = props.canonical || `${normalizedBase}${normalizedPath}`;

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      canonical,
    },
  };
}
