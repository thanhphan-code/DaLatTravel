import { foods, places } from "@/data/dalat";

export type ChatEntry = {
  id: string; name: string; kind: "place" | "food"; category: string;
  description: string; address: string; price: string; url: string; mapsUrl: string;
};
export type Recommendation = { id: string; reason: string };
export type ChatMessage = {
  role: "user" | "model"; text: string; recommendations?: Recommendation[];
  offline?: boolean; error?: string;
};
export const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/đ/g, "d");
const mapsUrl = (name: string, address: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${address || "Đà Lạt"}`)}`;

export const chatCatalog: ChatEntry[] = [
  ...places.map((place): ChatEntry => ({
    id: `place:${place.id}`, name: place.name, kind: "place", category: place.category,
    description: place.description, address: place.address || "", price: place.cost,
    url: `/place/${place.id}`, mapsUrl: mapsUrl(place.name, place.address || ""),
  })),
  ...foods.map((food): ChatEntry => ({
    id: `food:${food.id}`, name: food.name, kind: "food", category: food.category,
    description: food.description, address: food.address || "", price: food.price,
    url: `/food?item=${encodeURIComponent(food.id)}`, mapsUrl: mapsUrl(food.venue || food.name, food.address || ""),
  })),
];
export const catalogById = new Map(chatCatalog.map((entry) => [entry.id, entry]));

export function getChatContext(messages: ChatMessage[]) {
  const question = normalize(messages.filter((message) => message.role === "user").at(-1)?.text || "");
  const previousQuestions = messages.filter((message) => message.role === "user").slice(-4).map((message) => normalize(message.text));
  const followUp = /khac|them|nua|goi y tiep|cho do|noi do/.test(question);
  const topic = /ca phe|cafe|coffee|mon an|quan an|an gi|an sang|an trua|an toi|lau|banh|am thuc|do an|dia diem|di dau|tham quan|thien nhien|chup anh|san may/;
  const previousTopic = previousQuestions.slice(0, -1).reverse().find((text) => topic.test(text)) || "";
  const context = followUp && !topic.test(question) ? `${previousTopic} ${question}` : question;
  const seen = new Set(messages.flatMap((message) => message.recommendations?.map((item) => item.id) || []));
  const explicit = chatCatalog.filter((entry) => question.includes(normalize(entry.name)) || (entry.id === "place:langbiang" && /lang\s*biang/.test(question)));
  const cafe = /ca phe|cafe|coffee/.test(context);
  const food = /mon an|quan an|an gi|an sang|an trua|an toi|lau|banh|am thuc|do an|nem nuong|kem bo/.test(context);
  const travel = /dia diem|di dau|tham quan|du lich|da lat|lich trinh|thien nhien|chup anh|san may/.test(context);
  const words = context.split(/[^a-z0-9]+/).filter((word) => word.length > 2);
  const scored = chatCatalog.map((entry) => {
    const haystack = normalize(`${entry.name} ${entry.category} ${entry.description}`);
    const isCafe = /ca phe|cafe|coffee/.test(normalize(`${entry.name} ${entry.category}`));
    let score = words.reduce((total, word) => total + (haystack.includes(word) ? 1 : 0), 0);
    if (cafe && isCafe) score += 25;
    if (food && entry.kind === "food") score += 20;
    if (travel && !food && !cafe && entry.kind === "place") score += 10;
    if (explicit.some((item) => item.id === entry.id)) score += 100;
    return { entry, score, seen: seen.has(entry.id) };
  }).sort((a, b) => b.score - a.score);
  const relevant = scored.filter(({ entry, score }) => score > 0 && (
    explicit.length ? explicit.some((item) => item.id === entry.id) :
    cafe ? /ca phe|cafe|coffee/.test(normalize(`${entry.name} ${entry.category}`)) :
    food ? entry.kind === "food" : travel ? entry.kind === "place" : false
  ));
  const dietaryRestriction = /an chay|thuan chay|vegan|di ung|khong gluten|kieng/.test(context);
  const recommendations = relevant.filter(({ entry, seen: alreadySeen }) =>
    (!dietaryRestriction || entry.kind !== "food") && (explicit.length || !alreadySeen),
  ).slice(0, 3)
    .map(({ entry }) => ({ id: entry.id, reason: entry.description }));
  // Keep relevant and unseen alternatives early, but let AI reason over other categories too.
  const candidates = [...scored].sort((a, b) => Number(a.seen) - Number(b.seen) || b.score - a.score).slice(0, 60).map(({ entry }) => entry);
  return { candidates, seenIds: [...seen], explicitIds: explicit.map((entry) => entry.id), recommendations, relevant: relevant.length > 0, dietaryRestriction };
}

export function localChatReply(messages: ChatMessage[], error: string): ChatMessage {
  const context = getChatContext(messages);
  return {
    role: "model", offline: true, error,
    text: context.recommendations.length
      ? "Mình chưa kết nối được AI. Dưới đây là gợi ý từ dữ liệu có sẵn trên website; giá và giờ hoạt động cần xác nhận với địa điểm."
      : context.dietaryRestriction
        ? "Dữ liệu hiện có chưa xác minh thành phần món ăn và khả năng phục vụ chế độ ăn của bạn. Bạn nên liên hệ quán trước; mình chưa thể chọn quán phù hợp khi AI chưa kết nối."
      : context.relevant
        ? "Bạn đã xem hết các gợi ý phù hợp trong dữ liệu hiện có. Hãy thử đổi loại trải nghiệm hoặc hỏi rõ tên một nơi để xem lại."
        : "Mình chưa kết nối được AI để trả lời câu hỏi này. Bạn có thể thử lại, hoặc hỏi về địa điểm, món ăn và cà phê Đà Lạt để tra dữ liệu có sẵn.",
    recommendations: context.recommendations,
  };
}

export async function requestChatReply(messages: ChatMessage[], signal?: AbortSignal): Promise<ChatMessage> {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!baseUrl || !key || baseUrl.includes("<project-id>") || key.includes("...")) throw new Error("Dịch vụ AI chưa được cấu hình.");
  if (key.startsWith("sb_secret_")) throw new Error("Cấu hình không hợp lệ: trình duyệt chỉ được dùng publishable key.");
  const context = getChatContext(messages);
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  if (signal?.aborted) controller.abort();
  const timer = window.setTimeout(abort, 25000);
  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/functions/v1/travel-chat`, {
      method: "POST", signal: controller.signal,
      headers: { "Content-Type": "application/json", apikey: key },
      body: JSON.stringify({
        messages: messages.slice(-16).map(({ role, text, recommendations }) => {
          const shown = recommendations?.map((item, index) => `${index + 1}. ${catalogById.get(item.id)?.name || item.id}: ${item.reason}`).join("\n");
          return { role, text: (shown ? `${text.slice(0, 1500)}\nCác gợi ý đã hiển thị theo thứ tự:\n${shown}` : text).slice(0, 3000) };
        }),
        catalog: context.candidates.map(({ id, name, kind, category, description, address, price }) => ({ id, name, kind, category, description, address, price })),
        seenIds: context.seenIds.slice(-100), explicitIds: context.explicitIds,
      }),
    });
    if (!response.ok) {
      const errors: Record<number, string> = {
        401: "Khóa truy cập hoặc cấu hình xác thực AI không hợp lệ.", 403: "Dịch vụ AI từ chối truy cập.",
        404: "Chưa triển khai chức năng chat trên project Supabase này.",
        429: "AI đang hết hạn mức hoặc nhận quá nhiều yêu cầu. Hãy thử lại sau.",
        503: "Dịch vụ AI chưa sẵn sàng. Cần kiểm tra cấu hình Gemini trên server.",
        504: "AI trả lời quá chậm. Hãy thử lại.",
      };
      throw new Error(errors[response.status] || "Dịch vụ AI đang gặp lỗi. Hãy thử lại sau.");
    }
    const data = await response.json();
    if (typeof data.reply !== "string" || !data.reply.trim()) throw new Error("AI chưa trả về nội dung hợp lệ.");
    const ids = new Set<string>();
    const recommendations: Recommendation[] = [];
    for (const item of Array.isArray(data.recommendations) ? data.recommendations : []) {
      if (!item || !catalogById.has(item.id) || ids.has(item.id) || typeof item.reason !== "string") continue;
      if (context.seenIds.includes(item.id) && !context.explicitIds.includes(item.id)) continue;
      ids.add(item.id);
      recommendations.push({ id: item.id, reason: item.reason.slice(0, 500) });
      if (recommendations.length === 4) break;
    }
    return { role: "model", text: data.reply.slice(0, 12000), recommendations };
  } catch (error) {
    if (controller.signal.aborted) throw new Error("Kết nối AI đã hết thời gian chờ hoặc bị hủy.");
    if (error instanceof TypeError) throw new Error("Không kết nối được máy chủ AI. Kiểm tra mạng và project Supabase.");
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}
