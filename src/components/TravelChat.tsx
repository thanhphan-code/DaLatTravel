import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import { places } from "@/data/dalat";
import { addPlaceToTrip, readTrips } from "@/lib/savedTrips";
import { toast } from "sonner";

type ChatAction = { type: "link" | "add"; label: string; url?: string; placeId?: string };
type Message = { role: "user" | "model"; text: string; actions?: ChatAction[] };
const welcome: Message = { role: "model", text: "Chào bạn, mình là Mây ☁️ Mình có thể giúp bạn chọn địa điểm, món ăn hoặc lên lịch trình Đà Lạt." };

export default function TravelChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/đ/g, "d");
  const actionsFor = (question: string): ChatAction[] => {
    const text = normalize(question);
    const matchedPlace = places.find((place) => text.includes(normalize(place.name)) || (place.id === "langbiang" && text.includes("langbiang")));
    if (text.includes("them") && matchedPlace) return [{ type: "add", label: `Thêm ${matchedPlace.name} vào chuyến`, placeId: matchedPlace.id }];
    if (text.includes("ca phe") || text.includes("cafe")) return places.filter((place) => normalize(place.category).includes("ca phe") || place.id.includes("coffee")).slice(0, 3).map((place) => ({ type: "link", label: place.name, url: `/place/${place.id}` }));
    if (/\d\s*ngay|lich trinh|ngay \d/.test(text)) return [{ type: "link", label: "Tạo lịch trình từ gợi ý", url: "/planner" }];
    return [];
  };

  const runAction = (action: ChatAction) => {
    if (action.type !== "add" || !action.placeId) return;
    const trip = readTrips()[0];
    const place = places.find((item) => item.id === action.placeId);
    if (!trip || !place) return toast.error(trip ? "Không tìm thấy địa điểm" : "Bạn cần tạo một chuyến đi trước");
    addPlaceToTrip(trip.id, 0, "morning", place);
    toast.success(`Đã thêm ${place.name} vào Ngày 1, buổi sáng`);
    setMessages((current) => [...current, { role: "model", text: `Mây đã thêm ${place.name} vào buổi sáng Ngày 1 của chuyến “${trip.name}”.` }]);
  };

  const localReply = (question: string) => {
    const text = normalize(question);
    if (text.includes("ca phe") || text.includes("cafe")) return "Mây gợi ý bạn xem các quán cà phê bên dưới. Bạn có thể mở chi tiết rồi thêm thẳng vào lịch trình.";
    if (text.includes("lich trinh") || /\d\s*ngay/.test(text)) return "Mây chưa kết nối được dịch vụ tạo nội dung, nhưng bạn vẫn có thể mở công cụ lập lịch để tạo chuyến đi theo số ngày và ngân sách.";
    if (text.includes("them")) return "Mây chưa nhận diện được địa điểm cần thêm. Bạn hãy ghi rõ tên, ví dụ: “Thêm Langbiang vào lịch trình”.";
    return "Kết nối của Mây đang chập chờn. Bạn có thể hỏi lại về địa điểm, quán cà phê, thời tiết hoặc lịch trình Đà Lạt.";
  };

  const requestReply = async (conversation: Message[]) => {
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 30000);
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/travel-chat`, {
          method: "POST",
          signal: controller.signal,
          headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
          body: JSON.stringify({ messages: conversation.map(({ role, text }) => ({ role, text })) }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error || `Lỗi API (${response.status})`);
        if (!data?.reply) throw new Error("Mây chưa nhận được nội dung trả lời");
        window.clearTimeout(timeout);
        return data.reply as string;
      } catch (error) {
        window.clearTimeout(timeout);
        lastError = error instanceof Error ? error : new Error("Không thể kết nối");
        if (attempt === 0) await new Promise((resolve) => window.setTimeout(resolve, 700));
      }
    }
    throw lastError || new Error("Không thể kết nối");
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", text } as Message];
    setMessages(next); setInput(""); setLoading(true);
    try {
      const reply = await requestReply(next.filter((message) => message !== welcome));
      setMessages((current) => [...current, { role: "model", text: reply, actions: actionsFor(text) }]);
    } catch {
      setMessages((current) => [...current, { role: "model", text: localReply(text), actions: actionsFor(text) }]);
    }
    setLoading(false);
  }

  return <div className="fixed bottom-5 right-5 z-[1000]">
    {open && <div className="mb-3 w-[calc(100vw-2.5rem)] sm:w-[390px] h-[570px] max-h-[75vh] rounded-[28px] bg-card border border-border shadow-card overflow-hidden flex flex-col">
      <header className="bg-primary text-primary-foreground px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3"><span className="h-10 w-10 rounded-full bg-white/15 grid place-items-center"><Bot className="h-5 w-5" /></span><div><p className="font-semibold">Mây · Trợ lý Đà Lạt</p><p className="text-xs text-white/70 flex items-center gap-1"><Sparkles className="h-3 w-3" /> TravelDaLat2026</p></div></div>
        <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-white/10" aria-label="Đóng chat"><X className="h-5 w-5" /></button>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-muted/20">
        {messages.map((message, index) => <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${message.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border border-border rounded-bl-md"}`}><p>{message.text}</p>{message.actions && message.actions.length > 0 && <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">{message.actions.map((action) => action.type === "link" ? <Link key={action.label} to={action.url || "/"} onClick={() => setOpen(false)} className="rounded-xl bg-mist px-3 py-2 text-center text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground">{action.label}</Link> : <button key={action.label} onClick={() => runAction(action)} className="rounded-xl bg-apricot px-3 py-2 text-xs font-medium text-white hover:brightness-105">{action.label}</button>)}</div>}</div></div>)}
        {loading && <div className="flex"><div className="rounded-2xl rounded-bl-md px-4 py-3 bg-card border border-border"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div></div>}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={submit} className="p-3 border-t border-border bg-card flex gap-2">
        <input value={input} onChange={(event) => setInput(event.target.value)} maxLength={3000} placeholder="Hỏi Mây về Đà Lạt..." className="flex-1 min-w-0 rounded-full bg-muted/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
        <button disabled={!input.trim() || loading} className="h-11 w-11 rounded-full bg-apricot text-white grid place-items-center disabled:opacity-40" aria-label="Gửi tin nhắn"><Send className="h-4 w-4" /></button>
      </form>
    </div>}
    <button onClick={() => setOpen((value) => !value)} className="ml-auto h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-card grid place-items-center hover:scale-105 transition-transform" aria-label={open ? "Đóng chat" : "Mở trợ lý du lịch"}>{open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}</button>
  </div>;
}
