export function getOgImage(title: string, tag?: string) {
  const params = new URLSearchParams({ title });
  if (tag) params.set("tag", tag);
  return `/api/og/generate?${params.toString()}`;
}
