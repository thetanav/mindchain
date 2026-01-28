import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { adapter } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { messages = [], journalContext = "" } = await req.json();

    const userPrompt = messages[0]?.content || "";

    const stream = chat({
      adapter,
      systemPrompts: ["You are a supportive mental health assistant."],
      messages: [
        { role: "user", content: userPrompt }
      ]
    });

    return toServerSentEventsResponse(stream);
  } catch (error) {
    console.error("Error in /api/quiz-insights:", error);
    return new Response(JSON.stringify({ error: "Failed to generate insights" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}