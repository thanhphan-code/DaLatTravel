import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, ExternalLink, Loader2, MessageCircle, RefreshCw, Send, X } from "lucide-react";
import { Link } from "react-router-dom";
import { places } from "@/data/dalat";
import { addPlaceToTrip, readTrips } from "@/lib/savedTrips";
import { catalogById, localChatReply, normalize, requestChatReply, type ChatMessage } from "@/lib/travelChat";
import { toast } from "sonner";

type Message = ChatMessage & { addPlaceId?: string };
const welcome: Message = { role: "model", text: "Chào bạn, mình là Mây ☁️ Bạn muốn tìm nơi đi chơi, quán ăn hay hỏi điều gì? Cho mình biết sở thích và ngân sách để gợi ý phù hợp hơn nhé." };
const suggestions = ["Gợi ý quán ăn Đà Lạt", "Cà phê có view đẹp", "Địa điểm thiên nhiên ít đông"];

export default function TravelChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const pending = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView?.({ behavior: "smooth" }); }, [messages, loading, open]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => () => { controller.current?.abort(); }, []);

  const addPlace = (placeId: string) => {
    const trip = readTrips()[0];
    const place = places.find((item) => item.id === placeId);
    if (!trip || !place) return toast.error(trip ? "Không tìm thấy địa điểm" : "Bạn cần tạo một chuyến đi trước");
    try {
      if (!addPlaceToTrip(trip.id, 0, "morning", place)) return toast.error("Không thể thêm địa điểm vào chuyến đi này");
      toast.success(`Đã thêm ${place.name} vào Ngày 1`);
      setMessages((current) => [...current, { role: "model", text: `Mây đã thêm ${place.name} vào Ngày 1 của chuyến “${trip.name}”. Bạn có thể mở chuyến đi để xem giờ tham quan.` }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể lưu thay đổi chuyến đi");
    }
  };

  async function send(text: string, retry = false) {
    if (!text.trim() || pending.current) return;
    pending.current = true;
    const conversation = retry ? messages.slice(0, -1) : [...messages, { role: "user" as const, text: text.trim() }];
    setMessages(conversation); setInput(""); setLoading(true);
    const request = new AbortController();
    controller.current = request;
    const context = conversation.filter((message) => message !== welcome);
    const question = normalize(text);
    const requestedPlace = /\bthem\b/.test(question) ? places.find((place) => question.includes(normalize(place.name)) || (place.id === "langbiang" && /lang\s*biang/.test(question))) : undefined;
    try {
      const reply = await requestChatReply(context, request.signal);
      if (!request.signal.aborted) setMessages((current) => [...current, { ...reply, addPlaceId: requestedPlace?.id }]);
    } catch (error) {
      if (!request.signal.aborted) setMessages((current) => [...current, {
        ...localChatReply(context, error instanceof Error ? error.message : "Không kết nối được AI."),
        addPlaceId: requestedPlace?.id,
      }]);
    } finally {
      pending.current = false;
      if (!request.signal.aborted) setLoading(false);
    }
  }
  function submit(event: FormEvent) { event.preventDefault(); void send(input); }
  const reset = () => { if (!pending.current) { setMessages([welcome]); setInput(""); inputRef.current?.focus(); } };

  return <div className="fixed bottom-5 right-5 z-[1000]">
    {open && <section aria-label="Trò chuyện với Mây" onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }} className="mb-3 w-[calc(100vw-2.5rem)] sm:w-[420px] h-[620px] max-h-[80dvh] rounded-[28px] bg-card border border-border shadow-card overflow-hidden flex flex-col">
      <header className="bg-primary text-primary-foreground px-5 py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3"><Bot className="h-6 w-6 shrink-0" /><div><p className="font-semibold">Mây · Trợ lý Đà Lạt</p><p className="text-xs text-white/80">Gợi ý theo cuộc trò chuyện của bạn</p></div></div>
        <div className="flex"><button onClick={reset} disabled={loading} className="p-2 rounded-full hover:bg-white/10 disabled:opacity-40" aria-label="Cuộc trò chuyện mới"><RefreshCw className="h-4 w-4" /></button><button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-white/10" aria-label="Đóng khung chat"><X className="h-5 w-5" /></button></div>
      </header>
      <div role="log" aria-label="Nội dung hội thoại" aria-live="polite" className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-4 bg-muted/20">
        {messages.map((message, index) => <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[94%] min-w-0 rounded-2xl px-4 py-3 text-sm leading-relaxed break-words ${message.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border border-border rounded-bl-md"}`}>
            {message.offline && <p className="mb-2 text-xs font-medium text-amber-700">Gợi ý từ dữ liệu website · AI chưa kết nối</p>}
            <p className="whitespace-pre-wrap">{message.text}</p>
            {!!message.recommendations?.length && <div className="mt-3 space-y-3">{message.recommendations.map((item) => {
              const entry = catalogById.get(item.id);
              if (!entry) return null;
              return <article key={entry.id} className="rounded-xl border border-border bg-muted/30 p-3">
                <Link to={entry.url} onClick={() => setOpen(false)} className="font-semibold text-primary underline underline-offset-2">{entry.name}</Link>
                <p className="mt-1 text-xs">{item.reason}</p>
                {entry.address && <p className="mt-2 text-xs text-muted-foreground">{entry.address}</p>}
                <p className="mt-1 text-xs text-muted-foreground">{entry.price} · Giá tham khảo</p>
                <a href={entry.mapsUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary underline">Mở Google Maps <ExternalLink size={12} /></a>
              </article>;
            })}</div>}
            {message.addPlaceId && <button onClick={() => addPlace(message.addPlaceId!)} className="mt-3 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">Thêm {places.find((place) => place.id === message.addPlaceId)?.name} vào chuyến</button>}
            {message.error && <p className="mt-3 text-xs text-muted-foreground">{message.error}</p>}
            {message.offline && index === messages.length - 1 && <button disabled={loading} onClick={() => { const question = messages.slice(0, index).filter((item) => item.role === "user").at(-1)?.text; if (question) void send(question, true); }} className="mt-2 inline-flex items-center gap-1 text-xs text-primary underline"><RefreshCw size={12} />Thử kết nối AI lại</button>}
          </div>
        </div>)}
        {messages.length === 1 && <div className="flex flex-wrap gap-2">{suggestions.map((text) => <button key={text} onClick={() => void send(text)} className="rounded-full border border-primary/20 px-3 py-2 text-xs text-primary hover:bg-primary/5">{text}</button>)}</div>}
        {loading && <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Mây đang suy nghĩ…</p>}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={submit} className="p-3 border-t border-border bg-card flex gap-2">
        <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} maxLength={3000} aria-label="Tin nhắn cho Mây" placeholder="Hỏi Mây về Đà Lạt..." className="flex-1 min-w-0 rounded-full bg-muted/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
        <button disabled={!input.trim() || loading} className="h-11 w-11 shrink-0 rounded-full bg-primary text-primary-foreground grid place-items-center disabled:opacity-40" aria-label="Gửi tin nhắn"><Send className="h-4 w-4" /></button>
      </form>
    </section>}
    <button onClick={() => setOpen((value) => !value)} aria-expanded={open} className="ml-auto h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-card grid place-items-center hover:scale-105 transition-transform" aria-label={open ? "Đóng chat" : "Mở trợ lý du lịch"}>{open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}</button>
  </div>;
}
