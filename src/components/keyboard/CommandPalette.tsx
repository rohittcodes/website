"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@once-ui-system/core";
import { useChatUI } from "../chat/ChatUIContext";
import { HIRE_PROMPT } from "../chat/prompts";
import { filterPaletteItems, type PaletteItem } from "@/lib/palette";
import { useKeyboardNav } from "./KeyboardNavContext";
import styles from "./CommandPalette.module.scss";

const GROUP_ORDER: PaletteItem["group"][] = ["Actions", "Pages", "Work", "Blog"];

export function CommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const { paletteVisible, setPaletteVisible } = useKeyboardNav();
  const { openChat, openChatWithPrompt } = useChatUI();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => filterPaletteItems(items, query), [items, query]);

  const flatItems = filtered;

  useEffect(() => {
    if (!paletteVisible) {
      setQuery("");
      setActiveIndex(0);
      return;
    }
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [paletteVisible]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!paletteVisible) return;
    const active = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, paletteVisible, flatItems]);

  const runItem = (item: PaletteItem) => {
    setPaletteVisible(false);
    if (item.action === "chat") {
      openChat();
      return;
    }
    if (item.action === "hire") {
      openChatWithPrompt(HIRE_PROMPT);
      return;
    }
    if (item.href) {
      router.push(item.href);
    }
  };

  if (!paletteVisible) return null;

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    items: flatItems.filter((item) => item.group === group),
  })).filter((entry) => entry.items.length > 0);

  let runningIndex = -1;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-label="Command palette"
      onClick={() => setPaletteVisible(false)}
    >
      <div className={styles.panel} onClick={(event) => event.stopPropagation()}>
        <div className={styles.searchRow}>
          <span className={styles.searchIcon} aria-hidden="true">
            <Icon name="search" size="s" onBackground="neutral-weak" />
          </span>
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages, projects, posts…"
            aria-label="Search commands"
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((index) =>
                  flatItems.length ? (index + 1) % flatItems.length : 0,
                );
                return;
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((index) =>
                  flatItems.length
                    ? (index - 1 + flatItems.length) % flatItems.length
                    : 0,
                );
                return;
              }
              if (event.key === "Enter") {
                event.preventDefault();
                const item = flatItems[activeIndex];
                if (item) runItem(item);
                return;
              }
              if (event.key === "Escape") {
                event.preventDefault();
                setPaletteVisible(false);
              }
            }}
          />
        </div>

        <div className={styles.results} ref={listRef}>
          {grouped.length === 0 ? (
            <div className={styles.empty}>No matches</div>
          ) : (
            grouped.map((section) => (
              <div key={section.group} className={styles.group}>
                <p className={styles.groupTitle}>{section.group}</p>
                {section.items.map((item) => {
                  runningIndex += 1;
                  const index = runningIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={styles.item}
                      data-active={index === activeIndex}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => runItem(item)}
                    >
                      <span className={styles.itemTitle}>{item.title}</span>
                      {item.subtitle ? (
                        <span className={styles.itemSubtitle}>{item.subtitle}</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.footerHint}>
            <kbd className={styles.footerKbd} aria-label="Up">
              <Icon name="chevronUp" size="xs" />
            </kbd>
            <kbd className={styles.footerKbd} aria-label="Down">
              <Icon name="chevronDown" size="xs" />
            </kbd>
            navigate
          </span>
          <span className={styles.footerHint}>
            <kbd className={styles.footerKbd} aria-label="Enter">
              <Icon name="arrowTurnDownLeft" size="xs" />
            </kbd>
            open
          </span>
          <span className={styles.footerHint}>
            <kbd className={styles.footerKbd} aria-label="Escape">
              <Icon name="close" size="xs" />
            </kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
