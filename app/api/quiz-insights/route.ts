import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { adapter } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { answers, questions, journalContext }: { answers: string[]; questions?: string[]; journalContext?: string } =
      await req.json();

    const paired = answers
      .map(
        (a, i) => `Q${i + 1}: ${questions?.[i] ?? "(question)"}\nA${i + 1}: ${a}`
      )
      .join("\n\n");

    const userPrompt = `User Responses:
    
${paired}

${journalContext ? `Recent Journal Context:\n${journalContext}\n-- End of Journal Context --` : ''}

Analyze the user's mental health check responses. Provide empathetic, practical insights. Be concise, warm, and actionable. Avoid diagnosis; focus on encouragement and next steps.`;

    const stream = chat({
      adapter,
      systemPrompts: ["You are a supportive mental health assistant. Analyze the user's check-in responses and provide empathetic insights."],
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