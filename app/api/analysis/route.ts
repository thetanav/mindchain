import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { adapter } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { prompt, journalContext }: { prompt: string; journalContext?: string } = await req.json();

    const stream = chat({
      adapter,
      systemPrompts: [
        `You are an empathetic mental health AI assistant.
Analyze the following journal entry.
Provide a response with two parts:
1. Sentiment: A brief analysis of the user's mood.
2. Insight: A supportive, actionable piece of advice or observation.
Keep it concise and plain text.`,
      ],
      messages: [
        {
          role: "user",
          content: `Journal Entry: "${prompt}"\n\nContext: ${journalContext || "None"}`,
        },
      ],
    });

    return toServerSentEventsResponse(stream);
  } catch (error) {
    console.error("Error in /api/analysis:", error);
    return new Response(JSON.stringify({ error: "Analysis failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}