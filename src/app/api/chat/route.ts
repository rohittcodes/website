import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { groq } from "@ai-sdk/groq";
import { buildSystemPrompt } from "@/lib/ai/knowledge";
import { portfolioTools } from "@/lib/ai/tools";
import { getLatestUserText, logChatEvent } from "@/lib/db/chat-analytics";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return new Response("GROQ_API_KEY is not configured.", { status: 500 });
  }

  const {
    messages,
    pathname,
    sessionId,
  }: { messages: UIMessage[]; pathname?: string; sessionId?: string } =
    await req.json();

  const userText = getLatestUserText(messages);
  if (userText) {
    void logChatEvent({
      pathname: typeof pathname === "string" ? pathname : undefined,
      message: userText,
      sessionId: typeof sessionId === "string" ? sessionId : undefined,
    });
  }

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: buildSystemPrompt(
      typeof pathname === "string" ? pathname : undefined,
    ),
    messages: await convertToModelMessages(messages),
    tools: portfolioTools,
    stopWhen: isStepCount(4),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
