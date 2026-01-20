import { google } from '@ai-sdk/google';
import { streamText, type UIMessage } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const journalContext = "";

  const result = streamText({
    system: `You are an expert mental health therapist. Help user with mental health issues. Respond in plain text (no markdown), concise and supportive.
      If provided, consider the user's recent journal entries to personalize your guidance.
      Recent Journal Context (may be empty):\n${journalContext ?? ""
      }\n-- End of Journal Context --\n
      Rules:
      - Keep answers short and empathetic
      - Avoid clinical diagnoses; suggest coping strategies and next steps
      - Encourage seeking professional help if risk or crisis indicators appear`,
    model: google("gemini-2.0-flash"),
    messages,
  });

  return result.toTextStreamResponse();
}