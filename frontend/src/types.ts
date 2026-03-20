import * as z from "zod";

export const ChatMessage = z.object({
  message: z.string(),
});
