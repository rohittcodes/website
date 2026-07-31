"use client";

import { Button } from "@once-ui-system/core";
import { HotkeyTarget } from "../keyboard/HotkeyBadge";
import { useChatUI } from "./ChatUIContext";
import { HIRE_PROMPT } from "./prompts";

export function HireChatButton() {
  const { openChatWithPrompt } = useChatUI();

  const openHire = () => {
    openChatWithPrompt(HIRE_PROMPT);
  };

  return (
    <HotkeyTarget onActivate={openHire}>
      <Button
        data-border="rounded"
        variant="primary"
        size="m"
        weight="default"
        onClick={openHire}
      >
        Work together
      </Button>
    </HotkeyTarget>
  );
}
