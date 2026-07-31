"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type ChatUIContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  focusTick: number;
  openChat: () => void;
  focusChatInput: () => void;
  openChatWithPrompt: (prompt: string) => void;
  consumePendingPrompt: () => string | null;
};

const ChatUIContext = createContext<ChatUIContextValue | null>(null);

export function ChatUIProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [focusTick, setFocusTick] = useState(0);
  const pendingPromptRef = useRef<string | null>(null);

  const openChat = useCallback(() => {
    setOpen(true);
    setFocusTick((tick) => tick + 1);
  }, []);

  const focusChatInput = useCallback(() => {
    setOpen(true);
    setFocusTick((tick) => tick + 1);
  }, []);

  const openChatWithPrompt = useCallback((prompt: string) => {
    pendingPromptRef.current = prompt;
    setOpen(true);
    setFocusTick((tick) => tick + 1);
  }, []);

  const consumePendingPrompt = useCallback(() => {
    const prompt = pendingPromptRef.current;
    pendingPromptRef.current = null;
    return prompt;
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      focusTick,
      openChat,
      focusChatInput,
      openChatWithPrompt,
      consumePendingPrompt,
    }),
    [
      open,
      focusTick,
      openChat,
      focusChatInput,
      openChatWithPrompt,
      consumePendingPrompt,
    ],
  );

  return <ChatUIContext.Provider value={value}>{children}</ChatUIContext.Provider>;
}

export function useChatUI() {
  const context = useContext(ChatUIContext);
  if (!context) {
    throw new Error("useChatUI must be used within ChatUIProvider");
  }
  return context;
}
