const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ChatMessage = { role: "user" | "model"; text: string };

const SYSTEM_PROMPT = `Bạn là Mây, trợ lý du lịch thân thiện của Travel Da Lat 2026.
Luôn trả lời bằng tiếng Việt tự nhiên, ngắn gọn và thực tế trừ khi người dùng yêu cầu ngôn ngữ khác.
Bạn chuyên về Đà Lạt: lịch trình, địa điểm, món ăn, thời tiết, ngân sách và di chuyển.
Khi thông tin có thể thay đổi như giá vé hoặc giờ mở cửa, hãy nói rõ người dùng nên kiểm tra lại.
Không bịa thông tin. Không yêu cầu hay tiết lộ API key. Nếu câu hỏi không liên quan du lịch, vẫn hỗ trợ ngắn gọn rồi hướng về Đà Lạt.`;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return Response.json({ error: "Chatbot chưa được cấu hình GEMINI_API_KEY" }, { status: 503, headers: corsHeaders });

    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages.slice(-12).filter((item: ChatMessage) => ["user", "model"].includes(item?.role) && typeof item?.text === "string").map((item: ChatMessage) => ({ role: item.role, text: item.text.slice(0, 3000) }))
      : [];
    if (!messages.length || messages.at(-1)?.role !== "user") return Response.json({ error: "Tin nhắn không hợp lệ" }, { status: 400, headers: corsHeaders });

    const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages.map((message) => ({ role: message.role, parts: [{ text: message.text }] })),
        generationConfig: { temperature: 0.65, maxOutputTokens: 800 },
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      console.error("Gemini error", upstream.status, data?.error?.message);
      return Response.json({ reply: "Kết nối của Mây đang bận. Bạn vẫn có thể hỏi về địa điểm, quán cà phê hoặc dùng công cụ tạo lịch trình trên website." }, { headers: corsHeaders });
    }
    const reply = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("").trim();
    if (!reply) return Response.json({ reply: "Mây chưa hiểu câu hỏi này. Bạn thử hỏi rõ hơn về địa điểm, món ăn, thời tiết hoặc lịch trình Đà Lạt nhé." }, { headers: corsHeaders });
    return Response.json({ reply }, { headers: corsHeaders });
  } catch (error) {
    console.error("travel-chat error", error);
    return Response.json({ error: "Có lỗi khi xử lý hội thoại" }, { status: 500, headers: corsHeaders });
  }
});
