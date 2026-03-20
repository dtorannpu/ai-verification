import { createParser } from "eventsource-parser";
import { ChatMessage } from "./types";

export interface StreamChatRequest {
  message: string;
}

interface StreamChatOptions {
  signal?: AbortSignal;
  onDelta: (delta: string) => void;
  onDone?: () => void;
}

const STREAM_ENDPOINT =
  import.meta.env.VITE_CHAT_STREAM_ENDPOINT ?? "/api/chat/stream";

export async function streamChatCompletion(
  request: StreamChatRequest,
  options: StreamChatOptions,
): Promise<void> {
  const response = await fetch(STREAM_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(request),
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(
      `SSE request failed: ${response.status} ${response.statusText}`,
    );
  }

  if (!response.body) {
    throw new Error("SSE response body is missing");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let isFinished = false;

  const parser = createParser({
    onEvent(event) {
      if (!event.data) {
        return;
      }

      if (event.data === "[DONE]" || event.event === "done") {
        if (!isFinished) {
          isFinished = true;
          options.onDone?.();
        }
        return;
      }

      options.onDelta(ChatMessage.parse(JSON.parse(event.data)).message);
    },
  });

  while (true) {
    const { value, done } = await reader.read();
    parser.feed(decoder.decode(value, { stream: !done }));

    if (done) {
      break;
    }
  }

  if (!isFinished) {
    options.onDone?.();
  }
}
