"use client";

import dynamic from "next/dynamic";
import { MobileChatTrigger } from "./chat/MobileChatTrigger";

const ChatWidget = dynamic(
  () => import("./chat/ChatWidget").then((mod) => mod.ChatWidget),
  { ssr: false },
);

export function DeferredWidgets() {
  return (
    <>
      <ChatWidget />
      <MobileChatTrigger />
    </>
  );
}
