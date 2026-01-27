import { GoogleGenerativeAI } from "@google/generative-ai";
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

${journalContext ? `Recent Journal Context:\n${journalContext}\n-- End of Journal Context --` : ''}

Analyze the user's mental health check responses. Be concise, warm, and actionable. Avoid diagnosis; focus on encouragement and next steps.`;

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return NextResponse.json(text);
}