type SSEData = string;

function parseSseEvent(eventBlock: string): SSEData[] {
  // SSE events are separated by blank lines; within an event, multiple data lines can exist.
  const dataLines: string[] = [];
  for (const line of eventBlock.split("\n")) {
    if (line.startsWith("data:")) {
      dataLines.push(line.slice("data:".length).trimStart());
    }
  }
  if (dataLines.length === 0) return [];
  return [dataLines.join("\n")];
}

export async function* streamSseJson<T = unknown>(
  response: Response
): AsyncGenerator<T, void, unknown> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed (${response.status})`);
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE events end with a blank line.
    while (true) {
      const sepIndex = buffer.indexOf("\n\n");
      if (sepIndex === -1) break;

      const eventBlock = buffer.slice(0, sepIndex);
      buffer = buffer.slice(sepIndex + 2);

      for (const data of parseSseEvent(eventBlock)) {
        if (!data) continue;
        if (data === "[DONE]") return;
        try {
          yield JSON.parse(data) as T;
        } catch {
          // If it's not JSON, still yield as-is by wrapping.
          yield ({ type: "text-delta", content: data } as unknown) as T;
        }
      }
    }
  }
}

export async function* postSseJson<T = unknown>(
  url: string,
  body: unknown
): AsyncGenerator<T, void, unknown> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  yield* streamSseJson<T>(response);
}

