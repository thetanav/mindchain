import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { answers, questions, journalContext }: { answers: string[]; questions?: string[]; journalContext?: string } =
    await req.json();

  const paired = answers
    .map(
      (a, i) => `Q${i + 1}: ${questions?.[i] ?? "(question)"}\nA${i + 1}: ${a}`
    )
    .join("\n\n");

  const prompt = `You are a supportive mental health assistant. Given the user's self-check responses, provide empathetic, practical insights.
If provided, consider the user's recent journal entries to personalize your guidance.

User Responses:
    
${paired}

${journalContext ? `Recent Journal Context:\n${journalContext}\n-- End of Journal Context --` : ''}`;

  const result = await generateText({
    model: google("gemini-2.0-flash-lite"),
    system:
      "Analyze the user's mental health check responses. Be concise, warm, and actionable. Avoid diagnosis; focus on encouragement and next steps.",
    prompt,
  });

  return NextResponse.json(result.text);
}
