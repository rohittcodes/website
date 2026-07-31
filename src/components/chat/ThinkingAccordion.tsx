"use client";

import { useEffect, useState } from "react";
import { Icon, Text } from "@once-ui-system/core";
import styles from "./ChatWidget.module.scss";

export type ThinkingStep = {
  id: string;
  label: string;
  done: boolean;
};

function formatDuration(ms: number) {
  if (ms < 1000) return `${Math.max(1, Math.round(ms / 100) * 100)}ms`;
  const seconds = ms / 1000;
  return seconds < 10 ? `${seconds.toFixed(1)}s` : `${Math.round(seconds)}s`;
}

export function ThinkingAccordion({
  steps,
  durationMs,
  active = false,
}: {
  steps: ThinkingStep[];
  durationMs: number;
  active?: boolean;
}) {
  const [open, setOpen] = useState(active);

  useEffect(() => {
    setOpen(active);
  }, [active]);

  if (!active && steps.length === 0) return null;

  const title = active
    ? `Thinking… ${formatDuration(durationMs)}`
    : `Thought for ${formatDuration(durationMs)}`;

  return (
    <div className={styles.thinking}>
      <button
        type="button"
        className={styles.thinkingHeader}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span
          className={`${styles.thinkingChevron} ${open ? styles.thinkingChevronOpen : ""}`}
        >
          <Icon name="chevronDown" size="xs" onBackground="neutral-weak" />
        </span>
        <Text variant="label-default-s" onBackground="neutral-weak">
          {title}
        </Text>
      </button>

      {open && (
        <ul className={styles.thinkingSteps}>
          {steps.map((step) => (
            <li key={step.id} className={styles.thinkingStep} data-done={step.done}>
              <span className={styles.thinkingDot} aria-hidden />
              <span>{step.label}</span>
            </li>
          ))}
          {active && steps.length === 0 && (
            <li className={styles.thinkingStep} data-done={false}>
              <span className={styles.thinkingDot} aria-hidden />
              <span>Working on it…</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

const TOOL_LABELS: Record<string, string> = {
  "tool-listProjectTitles": "Looking up project titles",
  "tool-getProjects": "Loading project details",
  "tool-listBlogTitles": "Looking up post titles",
  "tool-getBlogPosts": "Loading blog posts",
  "tool-getAbout": "Loading about info",
  "tool-getUses": "Checking setup",
  "tool-getNow": "Checking what is current",
  "tool-getContactInfo": "Looking up contact options",
  "tool-navigateTo": "Finding a page to open",
  "tool-draftEmail": "Drafting an email",
  "tool-sendContactEmail": "Sending email",
};

export function getThinkingStepsFromParts(
  parts: Array<{ type: string; state?: string; toolCallId?: string }>,
): ThinkingStep[] {
  const byType = new Map<string, ThinkingStep>();

  for (const part of parts) {
    const type = part.type;
    if (!type.startsWith("tool-")) continue;
    const label = TOOL_LABELS[type];
    if (!label) continue;

    const done = part.state === "output-available";
    const existing = byType.get(type);
    if (!existing) {
      byType.set(type, {
        id: part.toolCallId ?? type,
        label,
        done,
      });
      continue;
    }

    if (done) existing.done = true;
  }

  return Array.from(byType.values());
}
