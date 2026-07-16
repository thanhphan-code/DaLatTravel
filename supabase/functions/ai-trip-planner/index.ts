const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" };
const modelUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

type PlanRequest = { days: string; travelType: string; budget: string; interests: string[]; transport: string; startTime: string };
type RawRecord = Record<string, unknown>;

const dayCountFrom = (value: string) => Math.min(4, Math.max(1, Number.parseInt(value, 10) || 1));
const textOf = (data: RawRecord) => {
  const candidates = data?.candidates as Array<{ content?: { parts?: Array<{ text?: string }> } }> | undefined;
  return candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || "";
};

const callGemini = async (apiKey: string, payload: RawRecord) => {
  const response = await fetch(modelUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify(payload),
  });
  const data = await response.json() as RawRecord;
  if (!response.ok) throw new Error(`Gemini ${response.status}: ${JSON.stringify(data).slice(0, 400)}`);
  return data;
};

const validatePlan = (value: unknown, dayCount: number) => {
  if (!value || typeof value !== "object") return false;
  const root = value as { summary?: unknown; days?: unknown[] };
  if (typeof root.summary !== "string" || !Array.isArray(root.days) || root.days.length !== dayCount) return false;
  return root.days.every((day) => {
    if (!day || typeof day !== "object") return false;
    const item = day as RawRecord;
    return ["morning", "afternoon", "evening"].every((period) => {
      const slot = item[period] as RawRecord | undefined;
      return slot && typeof slot.time === "string" && typeof slot.place === "string" && typeof slot.address === "string" && typeof slot.note === "string" && typeof slot.latitude === "number" && typeof slot.longitude === "number";
    }) && Array.isArray(item.food) && typeof item.cost === "string" && typeof item.notes === "string";
  });
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return Response.json({ error: "Phương thức không được hỗ trợ." }, { status: 405, headers: jsonHeaders });

  let body: PlanRequest;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Thông tin chuyến đi không hợp lệ." }, { status: 400, headers: jsonHeaders }); }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) return Response.json({ error: "Chưa cấu hình Gemini cho tính năng tạo lịch trình." }, { status: 503, headers: jsonHeaders });

  const dayCount = dayCountFrom(body.days);
  try {
    const variationAngles = [
      "ưu tiên địa điểm mới, ít đông và trải nghiệm bản địa",
      "cân bằng thiên nhiên, kiến trúc, ẩm thực và quán cà phê có phong cách riêng",
      "tạo nhịp đi chậm, nhiều góc chụp ảnh và hoạt động thư giãn",
      "ưu tiên trải nghiệm ngoài trời xen kẽ điểm trong nhà để linh hoạt thời tiết",
      "khám phá các khu vực khác nhau nhưng vẫn tối ưu quãng đường mỗi ngày",
    ];
    const variation = variationAngles[Math.floor(Math.random() * variationAngles.length)];
    const prompt = `Dùng Google Search để tìm địa điểm rồi tạo một lịch trình Đà Lạt hoàn toàn mới bằng tiếng Việt.

YÊU CẦU: ${dayCount} ngày; đi ${body.travelType}; ngân sách ${body.budget}; sở thích ${body.interests?.join(", ") || "tổng hợp"}; phương tiện ${body.transport}; giờ bắt đầu ngày đầu ${body.startTime}.
HƯỚNG BIẾN THỂ LẦN NÀY: ${variation}.

Quy tắc bắt buộc:
- Trả đúng ${dayCount} phần tử days và đúng một địa điểm chính cho mỗi buổi.
- Không dùng một lịch trình mẫu cố định, không lặp địa điểm giữa các ngày.
- Mỗi ngày phải có ít nhất 4 nhóm trải nghiệm khác nhau trong số: thiên nhiên, kiến trúc, văn hóa, ẩm thực, cà phê, mua sắm, vận động, thư giãn.
- Mỗi buổi có một địa điểm chính và một lựa chọn thay thế khác loại trong alternatives. Tổng cộng tối đa 6 địa điểm mỗi ngày để lịch không quá dày.
- Ít nhất một ngày có địa điểm ít nổi tiếng hoặc trải nghiệm bản địa, không chỉ dùng các điểm du lịch quen thuộc.
- Có thể chọn địa điểm ngoài dữ liệu của website, kể cả nơi mới hoặc ít nổi tiếng, miễn là có thật.
- Xếp các nơi gần nhau trong cùng ngày, thời gian di chuyển phải khả thi bằng ${body.transport}.
- Ghi tên, địa chỉ và tọa độ thực tế của từng nơi để vẽ bản đồ. Không chắc tọa độ thì chọn địa điểm khác.
- Mỗi ghi chú tối đa 30 từ; chi phí dùng VND; food có 2 đến 4 gợi ý cụ thể.
- Chỉ trả JSON thuần, không markdown, đúng cấu trúc: {"summary":"...","days":[{"label":"Ngày 1","theme":"...","morning":{"time":"HH:MM - HH:MM","place":"...","address":"...","latitude":11.9,"longitude":108.4,"note":"...","alternatives":[{"place":"...","address":"...","note":"..."}]},"afternoon":{"time":"...","place":"...","address":"...","latitude":11.9,"longitude":108.4,"note":"...","alternatives":[{"place":"...","address":"...","note":"..."}]},"evening":{"time":"...","place":"...","address":"...","latitude":11.9,"longitude":108.4,"note":"...","alternatives":[{"place":"...","address":"...","note":"..."}]},"food":["..."],"cost":"... VND","notes":"..."}]}`;

    const data = await callGemini(apiKey, {
      systemInstruction: { parts: [{ text: "Bạn là chuyên gia thiết kế hành trình Đà Lạt. Mỗi lần tạo phải cá nhân hóa theo yêu cầu và dữ liệu tìm kiếm, không sao chép lịch mẫu. Chỉ trả JSON đúng schema." }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      tools: [{ google_search: {} }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 8192 },
    });
    const text = textOf(data);
    if (!text) throw new Error("Gemini không trả nội dung");
    const parsed = JSON.parse(text.replace(/^```json\s*|\s*```$/g, "").trim());
    if (!validatePlan(parsed, dayCount)) throw new Error("Lịch trình trả về thiếu dữ liệu bắt buộc");
    return Response.json(parsed, { headers: jsonHeaders });
  } catch (error) {
    console.error("ai-trip-planner error", error);
    const message = error instanceof Error ? error.message : "";
    const quotaExceeded = message.includes("429") || message.toLowerCase().includes("quota");
    return Response.json({ error: quotaExceeded ? "Gemini đã hết hạn mức sử dụng hôm nay. Hãy thử lại khi hạn mức được làm mới hoặc bật thanh toán cho API." : "Gemini chưa tạo được lịch trình hoàn chỉnh. Vui lòng thử lại sau ít phút." }, { status: quotaExceeded ? 429 : 502, headers: jsonHeaders });
  }
});
