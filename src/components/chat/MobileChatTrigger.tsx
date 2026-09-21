"use client";

import { Avatar } from "@once-ui-system/core";
import { person } from "@/resources";
import { HotkeyTarget } from "../keyboard/HotkeyBadge";
import { CHAT_HOTKEY } from "../keyboard/navShortcuts";
import { useChatUI } from "./ChatUIContext";
import styles from "./ChatWidget.module.scss";

export function MobileChatTrigger() {
  const { open, setOpen } = useChatUI();

  if (open) return null;

  return (
    <div className={styles.mobileFab}>
      <HotkeyTarget label={CHAT_HOTKEY.key} fill>
        <button
          type="button"
          className={styles.mobileTrigger}
          onClick={() => setOpen(true)}
          aria-label="Open chat with Rohith"
          aria-expanded={false}
        >
          <Avatar src={person.avatar} size="l" />
        </button>
      </HotkeyTarget>
    </div>
  );
}
