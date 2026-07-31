"use client";

import { useEffect, useId, useRef } from "react";
import { useKeyboardNav } from "./KeyboardNavContext";
import styles from "./HotkeyBadge.module.scss";

export function HotkeyBadge({ label }: { label: string }) {
  const { hintsVisible } = useKeyboardNav();
  if (!label) return null;

  return (
    <span
      className={`${styles.badge} ${hintsVisible ? styles.visible : ""}`}
      aria-hidden={!hintsVisible}
    >
      {label}
    </span>
  );
}

export function HotkeyTarget({
  label,
  onActivate,
  enabled = true,
  children,
  className,
  fill,
  block,
}: {
  label?: string;
  onActivate?: () => void;
  enabled?: boolean;
  children: React.ReactNode;
  className?: string;
  fill?: boolean;
  block?: boolean;
}) {
  const id = useId();
  const { registerTarget, getTargetKey } = useKeyboardNav();
  const activateRef = useRef(onActivate);
  activateRef.current = onActivate;
  const hasActivate = Boolean(onActivate);

  useEffect(() => {
    if (!enabled || !hasActivate) return;
    return registerTarget(id, () => {
      activateRef.current?.();
    });
  }, [enabled, hasActivate, id, registerTarget]);

  const displayKey = label ?? (enabled ? getTargetKey(id) : null) ?? "";

  return (
    <span
      className={`${styles.wrap}${fill ? ` ${styles.wrapFill}` : ""}${
        block ? ` ${styles.wrapBlock}` : ""
      }${className ? ` ${className}` : ""}`}
    >
      {children}
      {displayKey ? <HotkeyBadge label={displayKey} /> : null}
    </span>
  );
}
