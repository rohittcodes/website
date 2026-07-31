import "server-only";

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type Sql = NeonQueryFunction<false, false>;

let ensurePromise: Promise<void> | null = null;

function getSql(): Sql | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  return neon(url);
}

async function ensureTable(sql: Sql) {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS chat_events (
          id BIGSERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          pathname TEXT NOT NULL DEFAULT '/',
          message TEXT NOT NULL,
          session_id TEXT
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS chat_events_created_at_idx
        ON chat_events (created_at DESC)
      `;
    })().catch((error) => {
      ensurePromise = null;
      throw error;
    });
  }
  await ensurePromise;
}

export async function logChatEvent(event: {
  pathname?: string;
  message: string;
  sessionId?: string | null;
}) {
  const sql = getSql();
  if (!sql) return;

  const message = event.message.trim().slice(0, 2000);
  if (!message) return;

  const pathname =
    typeof event.pathname === "string" && event.pathname.trim()
      ? event.pathname.trim().slice(0, 300)
      : "/";

  try {
    await ensureTable(sql);
    await sql`
      INSERT INTO chat_events (pathname, message, session_id)
      VALUES (
        ${pathname},
        ${message},
        ${event.sessionId?.trim() ? event.sessionId.trim().slice(0, 120) : null}
      )
    `;
  } catch (error) {
    console.error("Failed to log chat event:", error);
  }
}

export function getLatestUserText(messages: Array<{ role?: string; parts?: unknown }>) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role !== "user" || !Array.isArray(message.parts)) continue;

    const text = message.parts
      .map((part) => {
        if (!part || typeof part !== "object") return "";
        const typed = part as { type?: string; text?: string };
        return typed.type === "text" && typeof typed.text === "string" ? typed.text : "";
      })
      .join("\n")
      .trim();

    if (text) return text;
  }
  return null;
}
