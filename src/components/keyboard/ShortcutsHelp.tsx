"use client";

import { Icon } from "@once-ui-system/core";
import { useKeyboardNav } from "./KeyboardNavContext";
import { CHAT_HOTKEY, getNavShortcuts, HELP_TOGGLE, HINT_TOGGLE } from "./navShortcuts";
import styles from "./ShortcutsHelp.module.scss";

const SCROLL_ROWS = [
  { keys: ["j"], label: "Scroll down" },
  { keys: ["k"], label: "Scroll up" },
  { keys: ["d"], label: "Half page down" },
  { keys: ["u"], label: "Half page up" },
  { keys: ["g", "g"], label: "Top of page" },
  { keys: ["G"], label: "Bottom of page" },
] as const;

function formatKeyLabel(value: string) {
  if (value === "`") return "Backtick";
  return value;
}

function Kbd({ value }: { value: string }) {
  return <kbd className={styles.kbd}>{formatKeyLabel(value)}</kbd>;
}

export function ShortcutsHint() {
  const { helpVisible, setHelpVisible } = useKeyboardNav();

  if (helpVisible) return null;

  return (
    <button
      type="button"
      className={styles.hint}
      onClick={() => setHelpVisible(true)}
      aria-label="Keyboard shortcuts"
      title="Keyboard shortcuts"
    >
      <kbd className={styles.hintKbd}>{HELP_TOGGLE.key}</kbd>
      <span className={styles.hintLabel}>Shortcuts</span>
    </button>
  );
}

export function ShortcutsHelp() {
  const { helpVisible, setHelpVisible } = useKeyboardNav();

  if (!helpVisible) return null;

  const navRows = getNavShortcuts().map((item) => ({
    keys: [item.key],
    label:
      item.path === "/"
        ? "Home"
        : item.path.slice(1).replace(/^\w/, (c) => c.toUpperCase()),
  }));

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-label="Keyboard shortcuts"
      onClick={() => setHelpVisible(false)}
    >
      <div className={styles.panel} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <p className={styles.title}>Keyboard shortcuts</p>
          <button
            type="button"
            className={styles.close}
            onClick={() => setHelpVisible(false)}
            aria-label="Close shortcuts"
          >
            <Icon name="close" size="s" />
          </button>
        </div>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Mode</h3>
          <ul className={styles.list}>
            <li className={styles.row}>
              <span className={styles.label}>Show link badges</span>
              <span className={styles.keys}>
                <Kbd value={HINT_TOGGLE.key} />
              </span>
            </li>
            <li className={styles.row}>
              <span className={styles.label}>This cheat sheet</span>
              <span className={styles.keys}>
                <Kbd value={HELP_TOGGLE.key} />
              </span>
            </li>
            <li className={styles.row}>
              <span className={styles.label}>Command palette</span>
              <span className={styles.keys}>
                <kbd className={styles.kbd} aria-label="Command or Control K">
                  <Icon name="search" size="xs" />
                </kbd>
              </span>
            </li>
            <li className={styles.row}>
              <span className={styles.label}>Close / cancel</span>
              <span className={styles.keys}>
                <Kbd value="Esc" />
              </span>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Navigate</h3>
          <ul className={styles.list}>
            {navRows.map((row) => (
              <li key={row.label} className={styles.row}>
                <span className={styles.label}>{row.label}</span>
                <span className={styles.keys}>
                  <Kbd value={HINT_TOGGLE.key} />
                  <span className={styles.then} aria-hidden="true">
                    then
                  </span>
                  {row.keys.map((key) => (
                    <Kbd key={key} value={key} />
                  ))}
                </span>
              </li>
            ))}
            <li className={styles.row}>
              <span className={styles.label}>Open chat</span>
              <span className={styles.keys}>
                <Kbd value={HINT_TOGGLE.key} />
                <span className={styles.then} aria-hidden="true">
                  then
                </span>
                <Kbd value={CHAT_HOTKEY.key} />
              </span>
            </li>
            <li className={styles.row}>
              <span className={styles.label}>On-page links</span>
              <span className={styles.keys}>
                <Kbd value={HINT_TOGGLE.key} />
                <span className={styles.then} aria-hidden="true">
                  then
                </span>
                <Kbd value="A-Z" />
              </span>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Scroll</h3>
          <ul className={styles.list}>
            {SCROLL_ROWS.map((row) => (
              <li key={row.label} className={styles.row}>
                <span className={styles.label}>{row.label}</span>
                <span className={styles.keys}>
                  {row.keys.map((key, index) => (
                    <Kbd key={`${row.label}-${key}-${index}`} value={key} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
