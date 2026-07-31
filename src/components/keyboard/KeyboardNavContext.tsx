"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useChatUI } from "../chat/ChatUIContext";
import {
  CHAT_HOTKEY,
  DYNAMIC_HOTKEY_POOL,
  getNavShortcuts,
  HELP_TOGGLE,
  HINT_TOGGLE,
  RESERVED_HOTKEYS,
} from "./navShortcuts";
type KeyboardNavContextValue = {
  hintsVisible: boolean;
  helpVisible: boolean;
  setHelpVisible: (visible: boolean) => void;
  paletteVisible: boolean;
  setPaletteVisible: (visible: boolean) => void;
  registerTarget: (id: string, activate: () => void) => () => void;
  getTargetKey: (id: string) => string | null;
};

const KeyboardNavContext = createContext<KeyboardNavContextValue | null>(null);

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
}

const SCROLL_LINE = 72;

function scrollByLines(direction: 1 | -1) {
  window.scrollBy({ top: direction * SCROLL_LINE, behavior: "auto" });
}

function scrollByHalfPage(direction: 1 | -1) {
  window.scrollBy({ top: direction * window.innerHeight * 0.5, behavior: "auto" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "auto" });
}

function scrollToBottom() {
  window.scrollTo({
    top: Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    ),
    behavior: "auto",
  });
}

export function KeyboardNavProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { open, setOpen, openChat, focusChatInput } = useChatUI();
  const [hintsVisible, setHintsVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [paletteVisible, setPaletteVisible] = useState(false);
  const [registryVersion, setRegistryVersion] = useState(0);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const targetsRef = useRef(new Map<string, () => void>());
  const awaitingGRef = useRef(false);
  const awaitingGTimerRef = useRef<number | null>(null);
  const navShortcuts = useMemo(() => getNavShortcuts(), []);

  const clearAwaitingG = useCallback(() => {
    awaitingGRef.current = false;
    if (awaitingGTimerRef.current != null) {
      window.clearTimeout(awaitingGTimerRef.current);
      awaitingGTimerRef.current = null;
    }
  }, []);

  const hideHints = useCallback(() => {
    clearAwaitingG();
    setHintsVisible(false);
  }, [clearAwaitingG]);

  const registerTarget = useCallback((id: string, activate: () => void) => {
    targetsRef.current.set(id, activate);
    setRegistryVersion((version) => version + 1);
    return () => {
      targetsRef.current.delete(id);
      setRegistryVersion((version) => version + 1);
    };
  }, []);

  const getTargetKey = useCallback(
    (id: string) => assignments[id] ?? null,
    [assignments],
  );

  useEffect(() => {
    if (!hintsVisible) {
      setAssignments({});
      return;
    }

    const next: Record<string, string> = {};
    let poolIndex = 0;
    for (const id of targetsRef.current.keys()) {
      while (
        poolIndex < DYNAMIC_HOTKEY_POOL.length &&
        RESERVED_HOTKEYS.has(DYNAMIC_HOTKEY_POOL[poolIndex])
      ) {
        poolIndex += 1;
      }
      const key = DYNAMIC_HOTKEY_POOL[poolIndex];
      if (!key) break;
      next[id] = key;
      poolIndex += 1;
    }
    setAssignments(next);
  }, [hintsVisible, registryVersion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        clearAwaitingG();
        hideHints();
        setHelpVisible(false);
        setPaletteVisible((visible) => !visible);
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const typing = isEditableTarget(event.target);

      if (event.code === HINT_TOGGLE.code) {
        if (typing || paletteVisible) return;
        event.preventDefault();
        clearAwaitingG();
        setHelpVisible(false);
        setPaletteVisible(false);
        setHintsVisible((visible) => !visible);
        return;
      }

      if (event.key === HELP_TOGGLE.key) {
        if (typing || paletteVisible) return;
        event.preventDefault();
        clearAwaitingG();
        hideHints();
        setPaletteVisible(false);
        setHelpVisible((visible) => !visible);
        return;
      }

      if (event.key === "Escape") {
        if (awaitingGRef.current) {
          event.preventDefault();
          clearAwaitingG();
          return;
        }
        if (paletteVisible) {
          event.preventDefault();
          setPaletteVisible(false);
          return;
        }
        if (helpVisible) {
          event.preventDefault();
          setHelpVisible(false);
          return;
        }
        if (hintsVisible) {
          event.preventDefault();
          hideHints();
          return;
        }
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        return;
      }

      if (typing) return;

      if (helpVisible || paletteVisible) return;

      // Vim scroll when hint mode is off (letters are free for page movement).
      if (!hintsVisible) {
        if (event.key === "j") {
          event.preventDefault();
          clearAwaitingG();
          scrollByLines(1);
          return;
        }
        if (event.key === "k") {
          event.preventDefault();
          clearAwaitingG();
          scrollByLines(-1);
          return;
        }
        if (event.key === "d") {
          event.preventDefault();
          clearAwaitingG();
          scrollByHalfPage(1);
          return;
        }
        if (event.key === "u") {
          event.preventDefault();
          clearAwaitingG();
          scrollByHalfPage(-1);
          return;
        }
        if (event.key === "G") {
          event.preventDefault();
          clearAwaitingG();
          scrollToBottom();
          return;
        }
        if (event.key === "g") {
          event.preventDefault();
          if (awaitingGRef.current) {
            clearAwaitingG();
            scrollToTop();
            return;
          }
          awaitingGRef.current = true;
          awaitingGTimerRef.current = window.setTimeout(() => {
            awaitingGRef.current = false;
            awaitingGTimerRef.current = null;
          }, 600);
          return;
        }

        clearAwaitingG();
        return;
      }

      clearAwaitingG();

      if (event.code === CHAT_HOTKEY.code) {
        event.preventDefault();
        if (open) {
          focusChatInput();
        } else {
          openChat();
        }
        hideHints();
        return;
      }

      const navMatch = navShortcuts.find(
        (item) =>
          event.code === item.code || event.code === `Numpad${item.key}`,
      );

      if (navMatch) {
        event.preventDefault();
        router.push(navMatch.path);
        hideHints();
        return;
      }

      const pressed = event.key.length === 1 ? event.key.toUpperCase() : "";
      if (!pressed || RESERVED_HOTKEYS.has(pressed)) return;

      const entry = Object.entries(assignments).find(([, key]) => key === pressed);
      if (!entry) return;

      const activate = targetsRef.current.get(entry[0]);
      if (!activate) return;

      event.preventDefault();
      activate();
      hideHints();
    };

    const onBlur = () => hideHints();
    const onVisibility = () => {
      if (document.hidden) hideHints();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
      clearAwaitingG();
    };
  }, [
    assignments,
    clearAwaitingG,
    focusChatInput,
    helpVisible,
    hideHints,
    hintsVisible,
    navShortcuts,
    open,
    openChat,
    paletteVisible,
    router,
    setOpen,
  ]);

  const value = useMemo(
    () => ({
      hintsVisible,
      helpVisible,
      setHelpVisible,
      paletteVisible,
      setPaletteVisible,
      registerTarget,
      getTargetKey,
    }),
    [hintsVisible, helpVisible, paletteVisible, registerTarget, getTargetKey],
  );

  return (
    <KeyboardNavContext.Provider value={value}>{children}</KeyboardNavContext.Provider>
  );
}

export function useKeyboardNav() {
  const context = useContext(KeyboardNavContext);
  if (!context) {
    throw new Error("useKeyboardNav must be used within KeyboardNavProvider");
  }
  return context;
}
