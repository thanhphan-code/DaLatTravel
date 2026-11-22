import { afterEach, describe, expect, it, vi } from "vitest";
import { chatCatalog, getChatContext, localChatReply, requestChatReply, type ChatMessage } from "@/lib/travelChat";

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
describe("chat recommendations", () => {
  it("links food to a specific card and Maps; avoids previously shown cafes", () => {
    const history: ChatMessage[] = [{ role: "user", text: "Gợi ý cà phê" }];
    const first = localChatReply(history, "offline");
    expect(first.recommendations!.length).toBeGreaterThan(0);
    const next = localChatReply([...history, first, { role: "user", text: "Có quán khác nữa không?" }], "offline");
    expect(next.recommendations!.every((item) => !first.recommendations!.some((old) => old.id === item.id))).toBe(true);
    const food = getChatContext([{ role: "user", text: "Ăn gì ở Đà Lạt?" }]);
    expect(food.recommendations.length).toBeGreaterThan(0);
    for (const item of food.recommendations) {
      const entry = chatCatalog.find((entry) => entry.id === item.id)!;
      expect(entry.kind).toBe("food"); expect(entry.url).toContain("/food?item="); expect(entry.mapsUrl).toContain("https://www.google.com/maps/search/");
    }
  });
  it("does not pretend to answer general questions when offline", () => {
    const reply = localChatReply([{ role: "user", text: "Giải thích định lý Pythagoras" }], "offline");
    expect(reply.offline).toBe(true); expect(reply.recommendations).toHaveLength(0);
    expect(reply.text).toContain("chưa kết nối được AI");
  });
  it("allows revisiting an explicitly named place", () => {
    const entry = chatCatalog.find((entry) => entry.kind === "place")!;
    const context = getChatContext([{ role: "model", text: "Gợi ý", recommendations: [{ id: entry.id, reason: "" }] }, { role: "user", text: `Cho tôi biết thêm về ${entry.name}` }]);
    expect(context.recommendations.map((item) => item.id)).toContain(entry.id);
  });
  it("respects a topic change instead of recycling the previous category", () => {
    const context = getChatContext([{ role: "user", text: "Cà phê view đẹp" }, { role: "user", text: "Gợi ý quán ăn khác" }]);
    expect(context.recommendations.length).toBeGreaterThan(0);
    expect(context.recommendations.every((item) => item.id.startsWith("food:"))).toBe(true);
  });
  it("does not invent dietary suitability in offline suggestions", () => {
    const reply = localChatReply([{ role: "user", text: "Quán ăn chay, tôi bị dị ứng đậu" }], "offline");
    expect(reply.recommendations).toHaveLength(0);
    expect(reply.text).toContain("chưa xác minh thành phần");
  });
  it("validates model IDs and sends conversation context without links", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
    const entry = chatCatalog[0];
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ reply: "Xin chào", recommendations: [{ id: "javascript:alert(1)", reason: "bad" }, { id: entry.id, reason: "Hợp yêu cầu" }, { id: entry.id, reason: "duplicate" }] }) });
    vi.stubGlobal("fetch", fetch);
    const result = await requestChatReply([{ role: "user", text: "Đi đâu ở Đà Lạt?" }]);
    expect(result.recommendations).toEqual([{ id: entry.id, reason: "Hợp yêu cầu" }]);
    const payload = JSON.parse(fetch.mock.calls[0][1].body);
    expect(payload.messages[0].text).toContain("Đi đâu");
    expect(payload.catalog[0]).not.toHaveProperty("url");
  });
  it("does not automatically retry permanent failures", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
    const fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 }); vi.stubGlobal("fetch", fetch);
    await expect(requestChatReply([{ role: "user", text: "Xin chào" }])).rejects.toThrow("Chưa triển khai");
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
