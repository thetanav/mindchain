import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { ollamaText } from "@tanstack/ai-ollama";
// import { geminiText } from "@tanstack/ai-gemini";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as any;
    const { messages = [], conversationId, journalContext = "" } = body ?? {};

    const stream = chat({
      // adapter: geminiText("gemini-2.0-flash-lite"),
      adapter: ollamaText("gemma3:1b"),
      systemPrompts: [
        `You are an expert mental health therapist. Help user with mental health issues. Respond in plain text (no markdown), concise and supportive.
If provided, consider the user's recent journal entries to personalize your guidance.
Recent Journal Context (may be empty):\n${journalContext ?? ""}\n-- End of Journal Context --\n
Rules:
- Keep answers short and empathetic
- Avoid clinical diagnoses; suggest coping strategies and next steps
- Encourage seeking professional help if risk or crisis indicators appear`,
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