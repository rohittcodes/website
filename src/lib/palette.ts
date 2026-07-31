export type PaletteItem = {
  id: string;
  title: string;
  subtitle?: string;
  group: "Actions" | "Pages" | "Work" | "Blog";
  href?: string;
  action?: "chat" | "hire";
};

export function filterPaletteItems(items: PaletteItem[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return items.filter((item) => {
    const haystack = `${item.title} ${item.subtitle ?? ""} ${item.group}`.toLowerCase();
    return haystack.includes(q);
  });
}
