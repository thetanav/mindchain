import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function POST(req: Request) {
  const { prompt, journalContext }: { prompt: string; journalContext?: string } = await req.json();

  const result = await generateObject({
    model: google("gemini-2.0-flash-exp"),
    system:
      `Analyze the following journal entry and provide a brief, empathetic sentiment analysis in 2-3 sentences.
${journalContext ? `Consider the user's recent journal context for deeper insight: ${journalContext}` : ''}`,
    prompt,
    schema: z.object({
      sentiements: z.string(),
    }),
  });

  return result.toJsonResponse();
}
