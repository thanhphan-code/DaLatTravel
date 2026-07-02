// Streaming AI trip planner for Da Lat. Uses Lovable AI Gateway (Gemini).
// Later can be replaced by a Python FastAPI backend with the same request/response shape.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PlanRequest {
  days: string;
  travelType: string;
  budget: string;
  interests: string[];
  transport: string;
  startTime: string;
}

const SYSTEM_PROMPT = `You are a local Da Lat, Vietnam travel expert building day-by-day itineraries.

Da Lat highlights you know well:
- Nature: Xuan Huong Lake, Lang Biang Mountain (cloud hunting at sunrise), Datanla Waterfall, Tuyen Lam Lake, Pongour Waterfall
- Photo spots: Cau Dat Tea Hill, Domaine de Marie Church, Linh Phuoc Pagoda, Puppy Farm, hydrangea flower fields
- Cafes: Tiem Ca Phe Tui Mo To, F Cafe, Panorama Cafe, Mê Linh Coffee Garden
- Food: Lẩu gà lá é (chicken hotpot with basil), bánh căn, nem nướng Bà Hùng, bánh tráng nướng, sữa đậu nành nóng, artichoke tea
- Night: Da Lat Night Market, grilled skewers stalls
- Weather tip: cool year-round (15-24°C), afternoon showers common Apr-Oct

Return ONLY valid JSON matching this schema exactly:
{
  "summary": "1-sentence trip summary",
  "days": [
    {
      "label": "Day 1",
      "theme": "Short theme like 'Cloud hunting & tea hills'",
      "morning": { "time": "HH:MM", "place": "Place name", "note": "1-2 sentence tip" },
      "afternoon": { "time": "HH:MM", "place": "Place name", "note": "1-2 sentence tip" },
      "evening": { "time": "HH:MM", "place": "Place name", "note": "1-2 sentence tip" },
      "food": ["3-4 specific dish or restaurant suggestions"],
      "cost": "estimated VND range like '600,000 - 900,000 VND'",
      "notes": "1-2 practical travel tips for the day"
    }
  ]
}
No prose, no markdown fences, JSON only.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "AI is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: PlanRequest = await req.json();
    const userPrompt = `Build a Da Lat itinerary for:
- Duration: ${body.days}
- Travel type: ${body.travelType}
- Budget: ${body.budget}
- Interests: ${body.interests.join(", ") || "general sightseeing"}
- Transportation: ${body.transport}
- Start time each day: ${body.startTime}

Match the vibe. If interests include "cloud hunting", include a Lang Biang or Cau Dat sunrise. If "cafes", suggest hillside/pine-view cafes. Respect the budget when recommending food and activities. Return JSON only.`;

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (upstream.status === 429) {
      return new Response(JSON.stringify({ error: "AI is busy right now, please try again in a moment." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (upstream.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error("Gateway error", upstream.status, errText);
      return new Response(JSON.stringify({ error: "AI request failed", details: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await upstream.json();
    const content = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      // strip possible code fences
      const cleaned = content.replace(/^```json\s*|\s*```$/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ai-trip-planner error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
