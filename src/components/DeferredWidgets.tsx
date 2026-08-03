"use client";

import dynamic from "next/dynamic";
import type { PaletteItem } from "@/lib/palette";

const ChatWidget = dynamic(
  () => import("./chat/ChatWidget").then((mod) => mod.ChatWidget),
  { ssr: false },
);
const CommandPalette = dynamic(
  () => import("./keyboard/CommandPalette").then((mod) => mod.CommandPalette),
  { ssr: false },
);
const ShortcutsHint = dynamic(
  () => import("./keyboard/ShortcutsHelp").then((mod) => mod.ShortcutsHint),
  { ssr: false },
);
const ShortcutsHelp = dynamic(
  () => import("./keyboard/ShortcutsHelp").then((mod) => mod.ShortcutsHelp),
  { ssr: false },
);

export function DeferredWidgets({ paletteItems }: { paletteItems: PaletteItem[] }) {
  return (
    <>
      <ChatWidget />
      <CommandPalette items={paletteItems} />
      <ShortcutsHint />
      <ShortcutsHelp />
    </>
  );
}
