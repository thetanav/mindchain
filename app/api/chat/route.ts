import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { adapter } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as any;
    const { messages = [], conversationId, journalContext = "" } = body ?? {};

    const stream = chat({
      adapter,
      systemPrompts: [
        `You are MindChain, an empathetic and supportive mental health companion.
Your goal is to listen, validate feelings, and offer gentle, practical advice.
Do not provide medical diagnoses. If the user seems to be in crisis, urge them to seek professional help.

${journalContext ? `Here is some context from the user's recent journal entries to help you understand them better:\n${journalContext}\n-- End of Context --` : ""}

Be conversational, warm, and concise.`,
      ],
      messages,
      conversationId,
    });

    return toServerSentEventsResponse(stream);
  } catch (error) {
    console.error("Error in /api/chat:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}