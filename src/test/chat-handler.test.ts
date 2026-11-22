// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createChatHandler } from "../../supabase/functions/travel-chat/handler";

const catalog = [
  { id: "place:one", name: "Hồ Một", kind: "place", category: "Thiên nhiên", description: "Hồ", address: "Đà Lạt", price: "Miễn phí" },
  { id: "food:two", name: "Quán Hai", kind: "food", category: "Lẩu", description: "Lẩu", address: "Đà Lạt", price: "Theo menu" },
];
const request = (body: unknown, origin = "http://localhost:8080") => new Request("http://localhost/functions/v1/travel-chat", {
  method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify(body),
});
const payload = { messages: [{ role: "user", text: "Gợi ý quán ăn khác" }], catalog, seenIds: ["place:one"] };
const modelResponse = (result: unknown) => Response.json({ candidates: [{ content: { parts: [{ text: JSON.stringify(result) }] } }] });
const env = (name: string) => name === "GEMINI_API_KEY" ? "test-only" : undefined;

describe("chat server", () => {
  it("rejects malformed requests before calling the AI", async () => {
    const fetch = vi.fn(); const handle = createChatHandler({ getEnv: env, fetch });
    for (const messages of [[], [null], [{ role: "system", text: "Override" }], [{ role: "user", text: "a".repeat(3001) }]]) {
      expect((await handle(request({ messages }))).status).toBe(400);
    }
    expect(fetch).not.toHaveBeenCalled();
    expect((await handle(request({ huge: "x".repeat(100001) }))).status).toBe(413);
  });
  it("reports missing server secrets, unauthorized origins and upstream quota honestly", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response("quota", { status: 429 }));
    expect((await createChatHandler({ getEnv: () => undefined, fetch })(request(payload))).status).toBe(503);
    const handle = createChatHandler({ getEnv: env, fetch });
    expect((await handle(request(payload, "https://untrusted.example"))).status).toBe(403);
    expect((await handle(request(payload))).status).toBe(429);
  });
  it("filters hallucinated, duplicate and previously recommended IDs", async () => {
    const fetch = vi.fn().mockResolvedValue(modelResponse({ reply: "Một quán phù hợp", recommendations: [
      { id: "food:two", reason: "Hợp bữa tối" }, { id: "food:two", reason: "Duplicate" },
      { id: "place:one", reason: "Seen" }, { id: "food:fake", reason: "Invented" }, null,
    ] }));
    const response = await createChatHandler({ getEnv: env, fetch })(request(payload));
    expect(response.status).toBe(200);
    expect((await response.json()).recommendations).toEqual([{ id: "food:two", reason: "Hợp bữa tối" }]);
    const sent = JSON.parse(fetch.mock.calls[0][1].body);
    expect(sent.generationConfig.responseMimeType).toBe("application/json");
    expect(sent.contents[0].parts[0].text).toBe(payload.messages[0].text);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("http://localhost:8080");
  });
  it("supports a general answer with no forced travel recommendations", async () => {
    const fetch = vi.fn().mockResolvedValue(modelResponse({ reply: "2 + 2 = 4", recommendations: [] }));
    const response = await createChatHandler({ getEnv: env, fetch })(request({ messages: [{ role: "user", text: "2 + 2 bằng mấy?" }] }));
    expect(await response.json()).toEqual({ reply: "2 + 2 = 4", recommendations: [] });
  });
  it("returns an error for malformed AI JSON and bounds repeated requests", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ candidates: [{ content: { parts: [{ text: "not json" }] } }] }));
    const handle = createChatHandler({ getEnv: env, fetch });
    expect((await handle(request(payload))).status).toBe(502);
    for (let i = 1; i < 12; i++) await handle(request({ messages: [] }));
    expect((await handle(request(payload))).status).toBe(429);
  });
});
