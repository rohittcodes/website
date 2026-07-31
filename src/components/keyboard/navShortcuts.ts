import { routes } from "@/resources";

export type NavShortcut = {
  key: string;
  path: string;
  code: string;
};

const HEADER_ROUTES = [
  { path: "/", key: "1", code: "Digit1" },
  { path: "/about", key: "2", code: "Digit2" },
  { path: "/work", key: "3", code: "Digit3" },
  { path: "/blog", key: "4", code: "Digit4" },
  { path: "/uses", key: "5", code: "Digit5" },
] as const;

export const CHAT_HOTKEY = {
  key: "C",
  code: "KeyC",
} as const;

/** Toggle shortcut badges. Backtick avoids Windows/Chrome Alt menu focus. */
export const HINT_TOGGLE = {
  key: "`",
  code: "Backquote",
} as const;

/** Toggle the shortcuts cheat sheet. */
export const HELP_TOGGLE = {
  key: "?",
  code: "Slash", // Shift+/ on most layouts; also match event.key === "?"
} as const;

/** Keys reserved for header nav + chat + toggle. */
export const RESERVED_HOTKEYS = new Set<string>([
  ...HEADER_ROUTES.map((item) => item.key),
  CHAT_HOTKEY.key,
  HINT_TOGGLE.key,
]);

/** Assigned to on-page links in registration order while hints are open. */
export const DYNAMIC_HOTKEY_POOL = "ABDEFGHIJKLMNOPQRSTUVWXYZ67890".split("");

export function getNavShortcuts(): NavShortcut[] {
  return HEADER_ROUTES.filter(
    (item) => routes[item.path as keyof typeof routes],
  ).map((item) => ({
    key: item.key,
    path: item.path,
    code: item.code,
  }));
}

export function hotkeyForPath(path: string): string | null {
  return getNavShortcuts().find((item) => item.path === path)?.key ?? null;
}
