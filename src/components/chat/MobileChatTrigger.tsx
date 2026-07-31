"use client";

import { Avatar } from "@once-ui-system/core";
import { person } from "@/resources";
import { HotkeyTarget } from "../keyboard/HotkeyBadge";
import { CHAT_HOTKEY } from "../keyboard/navShortcuts";
import { useChatUI } from "./ChatUIContext";
import styles from "./ChatWidget.module.scss";

export function MobileChatTrigger() {
  const { open, setOpen } = useChatUI();

  return (
    <HotkeyTarget label={CHAT_HOTKEY.key} fill>
      <button
        type="button"
        className={`${styles.mobileTrigger} ${open ? styles.mobileTriggerActive : ""}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Open chat with Rohith"}
        aria-expanded={open}
      >
        <Avatar src={person.avatar} size="l" />
      </button>
    </HotkeyTarget>
  );
}
