"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Avatar, Column, Icon, IconButton, Text } from "@once-ui-system/core";
import { person } from "@/resources";
import {
  ATTRACTION_MESSAGES,
  suggestedPromptsForPath,
  welcomeForPath,
} from "./attraction";
import {
  DraftEmailCard,
  NavigateCard,
  ProjectsCard,
  SendResultCard,
} from "./ToolCards";
import {
  getThinkingStepsFromParts,
  ThinkingAccordion,
} from "./ThinkingAccordion";
import { HotkeyTarget } from "../keyboard/HotkeyBadge";
import { CHAT_HOTKEY } from "../keyboard/navShortcuts";
import { useChatUI } from "./ChatUIContext";
import styles from "./ChatWidget.module.scss";

function getToolOutput(part: unknown) {
  if (!part || typeof part !== "object") return null;
  const toolPart = part as { state?: string; output?: unknown };
  if (toolPart.state !== "output-available") return null;
  return toolPart.output ?? null;
}

function getFollowUpPrompts(message: UIMessage): string[] {
  for (const part of message.parts) {
    if ((part.type as string) !== "tool-suggestFollowUps") continue;
    const output = getToolOutput(part) as { prompts?: string[] } | null;
    if (output?.prompts?.length) {
      return output.prompts.map((prompt) => prompt.trim()).filter(Boolean).slice(0, 3);
    }
  }
  return [];
}

function MessageParts({
  message,
  durationMs,
  isActive,
}: {
  message: UIMessage;
  durationMs?: number;
  isActive?: boolean;
}) {
  if (message.role === "user") {
    return (
      <>
        {message.parts.map((part, index) => {
          if (part.type === "text" && part.text.trim()) {
            return (
              <div
                key={`${message.id}-${index}`}
                className={`${styles.bubble} ${styles.bubbleUser}`}
              >
                {part.text}
              </div>
            );
          }
          return null;
        })}
      </>
    );
  }

  const steps = getThinkingStepsFromParts(
    message.parts as Array<{ type: string; state?: string }>,
  );

  // Stream order is often tools-then-text; always show explanation before action cards.
  const textParts: Array<{ key: string; text: string }> = [];
  const toolParts: Array<{ key: string; node: ReactNode }> = [];

  message.parts.forEach((part, index) => {
    const key = `${message.id}-${index}`;
    const type = part.type as string;

    if (type === "text" && "text" in part && String(part.text).trim()) {
      textParts.push({ key, text: String(part.text) });
      return;
    }

    if (type === "tool-navigateTo") {
      const output = getToolOutput(part) as
        | {
            ok: boolean;
            path?: string;
            reason?: string | null;
            error?: string;
          }
        | null;
      if (!output) return;
      toolParts.push({ key, node: <NavigateCard output={output} /> });
      return;
    }

    if (type === "tool-getProjects") {
      const output = getToolOutput(part) as
        | Array<{ title: string; summary: string; path: string }>
        | null;
      if (!output) return;
      toolParts.push({ key, node: <ProjectsCard projects={output} /> });
      return;
    }

    if (type === "tool-draftEmail") {
      const output = getToolOutput(part) as
        | {
            status: "draft";
            to: string;
            visitorName: string | null;
            visitorEmail: string | null;
            subject: string;
            message: string;
            needsConfirmation: boolean;
          }
        | null;
      if (!output) return;
      toolParts.push({ key, node: <DraftEmailCard output={output} /> });
      return;
    }

    if (type === "tool-sendContactEmail") {
      const output = getToolOutput(part) as
        | { ok: boolean; message?: string; error?: string }
        | null;
      if (!output) return;
      toolParts.push({ key, node: <SendResultCard output={output} /> });
    }
  });

  return (
    <>
      {(steps.length > 0 || isActive) && (
        <ThinkingAccordion
          steps={steps}
          durationMs={durationMs ?? 0}
          active={Boolean(isActive)}
        />
      )}

      {textParts.map((part) => (
        <div key={part.key} className={`${styles.bubble} ${styles.bubbleAssistant}`}>
          {part.text}
        </div>
      ))}

      {toolParts.map((part) => (
        <div key={part.key}>{part.node}</div>
      ))}
    </>
  );
}

export function ChatWidget() {
  const { open, setOpen, focusTick, consumePendingPrompt } = useChatUI();
  const pathname = usePathname() ?? "/";
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const sessionIdRef = useRef<string>("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [liveElapsedMs, setLiveElapsedMs] = useState(0);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const thinkStartRef = useRef<number | null>(null);
  const pendingDurationRef = useRef<number | null>(null);

  useEffect(() => {
    const key = "chat-session-id";
    const existing = window.sessionStorage.getItem(key);
    if (existing) {
      sessionIdRef.current = existing;
      return;
    }
    const nextId =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `chat-${Date.now()}`;
    window.sessionStorage.setItem(key, nextId);
    sessionIdRef.current = nextId;
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({
          pathname: pathnameRef.current,
          sessionId: sessionIdRef.current || undefined,
        }),
      }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

  const isBusy = status === "streaming" || status === "submitted";
  const welcome = welcomeForPath(pathname);
  const suggestedPrompts = suggestedPromptsForPath(pathname);

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const activeAssistantId =
    isBusy && lastAssistant && messages[messages.length - 1]?.role === "assistant"
      ? lastAssistant.id
      : null;

  const rotateAttraction = useEffectEvent(() => {
    setMessageIndex((index) => (index + 1) % ATTRACTION_MESSAGES.length);
  });

  const resizeInput = useEffectEvent(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(40, Math.min(el.scrollHeight, 120))}px`;
  });

  useEffect(() => {
    if (open) return;
    const id = window.setInterval(rotateAttraction, 4500);
    return () => window.clearInterval(id);
  }, [open]);

  useEffect(() => {
    if (!open || focusTick === 0) return;
    const pending = consumePendingPrompt();
    if (pending) {
      setInput(pending);
      setShowSuggestions(false);
    }
    const id = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [open, focusTick, consumePendingPrompt]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open, status, liveElapsedMs]);

  useEffect(() => {
    resizeInput();
  }, [input]);

  useEffect(() => {
    if (!isBusy || thinkStartRef.current == null) {
      return;
    }

    const tick = () => {
      if (thinkStartRef.current == null) return;
      setLiveElapsedMs(Date.now() - thinkStartRef.current);
    };

    tick();
    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [isBusy]);

  useEffect(() => {
    if (isBusy) return;
    if (thinkStartRef.current == null && pendingDurationRef.current == null) return;

    const duration =
      pendingDurationRef.current ??
      (thinkStartRef.current != null ? Date.now() - thinkStartRef.current : 0);

    const assistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (assistant) {
      setDurations((prev) =>
        prev[assistant.id] != null ? prev : { ...prev, [assistant.id]: duration },
      );
    }

    thinkStartRef.current = null;
    pendingDurationRef.current = null;
    setLiveElapsedMs(0);
  }, [isBusy, messages]);

  const submitText = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isBusy) return;
    setShowSuggestions(false);
    setInput("");
    thinkStartRef.current = Date.now();
    pendingDurationRef.current = null;
    setLiveElapsedMs(0);
    void sendMessage({ text: trimmed });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitText(input);
  };

  const liveSteps =
    activeAssistantId && lastAssistant
      ? getThinkingStepsFromParts(
          lastAssistant.parts as Array<{ type: string; state?: string }>,
        )
      : [];

  return (
    <div
      className={`${styles.root} ${open ? styles.rootOpen : styles.rootCollapsedDesktop}`}
    >
      {open ? (
        <div className={styles.panel} role="dialog" aria-label="Chat with Rohith's AI">
          <div className={styles.header}>
            <div className={styles.headerMeta}>
              <Avatar src={person.avatar} size="s" />
              <Column gap="2">
                <Text variant="label-default-s">Chat with Rohith</Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  Ask about work, stack, or contact
                </Text>
              </Column>
            </div>
            <IconButton
              icon="close"
              size="m"
              variant="ghost"
              tooltip="Close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            />
          </div>

          <div className={styles.messages} ref={listRef}>
            <div className={`${styles.messageGroup} ${styles.messageGroupAssistant}`}>
              <div className={`${styles.bubble} ${styles.bubbleAssistant}`}>{welcome}</div>
            </div>

            {messages.map((message) => {
              const isActive = message.id === activeAssistantId;
              const durationMs = isActive
                ? liveElapsedMs
                : durations[message.id];
              const isLatestAssistant =
                !isBusy &&
                message.role === "assistant" &&
                message.id === lastAssistant?.id;
              const followUps = isLatestAssistant ? getFollowUpPrompts(message) : [];

              return (
                <div
                  key={message.id}
                  className={`${styles.messageGroup} ${
                    message.role === "user"
                      ? styles.messageGroupUser
                      : styles.messageGroupAssistant
                  }`}
                >
                  <MessageParts
                    message={message}
                    durationMs={durationMs}
                    isActive={isActive}
                  />
                  {followUps.length > 0 && (
                    <div className={styles.followUps}>
                      {followUps.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          className={styles.suggestion}
                          onClick={() => submitText(prompt)}
                          disabled={isBusy}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isBusy && !activeAssistantId && (
              <div className={`${styles.messageGroup} ${styles.messageGroupAssistant}`}>
                <ThinkingAccordion
                  steps={liveSteps}
                  durationMs={liveElapsedMs}
                  active
                />
              </div>
            )}

            {error && (
              <div className={`${styles.bubble} ${styles.bubbleAssistant}`}>
                Something went wrong on my end. Try again in a bit, or{" "}
                <a href={`mailto:${person.email}`}>drop me an email</a> if you'd rather
                just reach out directly.
              </div>
            )}
          </div>

          {showSuggestions && messages.length === 0 && (
            <div className={styles.suggestions}>
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className={styles.suggestion}
                  onClick={() => submitText(prompt)}
                  disabled={isBusy}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <form className={styles.composer} onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask anything about me…"
              rows={1}
              disabled={isBusy}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submitText(input);
                }
              }}
            />
            <IconButton
              type="submit"
              className={styles.send}
              icon="send"
              size="l"
              variant="primary"
              disabled={!input.trim() || isBusy}
              aria-label="Send message"
            />
          </form>
        </div>
      ) : (
        <HotkeyTarget label={CHAT_HOTKEY.key}>
          <button
            type="button"
            className={styles.trigger}
            onClick={() => setOpen(true)}
            aria-label="Open chat with Rohith"
          >
            <Avatar src={person.avatar} size="m" />
            <span className={styles.triggerCopy}>
              <span className={styles.triggerLabel}>Ask Me</span>
              <span className={styles.messageSlot}>
                {ATTRACTION_MESSAGES.map((message, index) => (
                  <span
                    key={message}
                    className={styles.message}
                    data-active={index === messageIndex}
                    aria-hidden={index !== messageIndex}
                  >
                    {message}
                  </span>
                ))}
              </span>
            </span>
            <span className={styles.triggerChevron}>
              <Icon name="chevronRight" size="s" onBackground="neutral-weak" />
            </span>
          </button>
        </HotkeyTarget>
      )}
    </div>
  );
}
