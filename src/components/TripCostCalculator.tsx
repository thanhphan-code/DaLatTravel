import { useMemo, useState } from "react";
import { Bike, Calculator, Car, Home, Ticket, Utensils, Users } from "lucide-react";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const budgetRates = {
  "tiết kiệm": { food: 180000, ticket: 100000, stay: 250000 },
  "trung bình": { food: 300000, ticket: 180000, stay: 450000 },
  cao: { food: 500000, ticket: 300000, stay: 800000 },
};
const transportRates = { "xe máy": 90000, taxi: 220000, "ô tô": 320000 };

export default function TripCostCalculator({ initialDays, initialBudget }: { initialDays: number; initialBudget: string }) {
  const [people, setPeople] = useState(2);
  const [days, setDays] = useState(initialDays);
  const [budget, setBudget] = useState<keyof typeof budgetRates>((initialBudget.toLowerCase() in budgetRates ? initialBudget.toLowerCase() : "trung bình") as keyof typeof budgetRates);
  const [transport, setTransport] = useState<keyof typeof transportRates>("xe máy");
  const costs = useMemo(() => {
    const rate = budgetRates[budget];
    const food = rate.food * people * days;
    const tickets = rate.ticket * people * days;
    const travel = transportRates[transport] * days * (transport === "xe máy" ? Math.ceil(people / 2) : 1);
    const stay = rate.stay * Math.max(0, days - 1) * Math.ceil(people / 2);
    return { food, tickets, travel, stay, total: food + tickets + travel + stay };
  }, [budget, days, people, transport]);

  return (
    <section className="mt-12 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <div className="grid lg:grid-cols-[.9fr_1.1fr]">
        <div className="bg-mist/40 p-6 md:p-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary"><Calculator className="h-5 w-5" /> Dự toán chuyến đi</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold">Đi Đà Lạt cần bao nhiêu?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Thay đổi lựa chọn để xem chi phí ước tính. Giá thực tế có thể thay đổi theo mùa và nơi bạn đặt dịch vụ.</p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Control label="Số người"><select value={people} onChange={(event) => setPeople(Number(event.target.value))}>{Array.from({ length: 10 }, (_, index) => <option key={index + 1}>{index + 1}</option>)}</select></Control>
            <Control label="Số ngày"><select value={days} onChange={(event) => setDays(Number(event.target.value))}>{Array.from({ length: 7 }, (_, index) => <option key={index + 1}>{index + 1}</option>)}</select></Control>
            <Control label="Ngân sách"><select value={budget} onChange={(event) => setBudget(event.target.value as keyof typeof budgetRates)}><option value="tiết kiệm">Tiết kiệm</option><option value="trung bình">Trung bình</option><option value="cao">Cao</option></select></Control>
            <Control label="Phương tiện"><select value={transport} onChange={(event) => setTransport(event.target.value as keyof typeof transportRates)}><option value="xe máy">Xe máy</option><option value="taxi">Taxi</option><option value="ô tô">Ô tô</option></select></Control>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <div className="divide-y divide-border">
            <CostRow icon={Utensils} label="Ăn uống" value={costs.food} />
            <CostRow icon={Ticket} label="Vé tham quan" value={costs.tickets} />
            <CostRow icon={transport === "xe máy" ? Bike : Car} label="Di chuyển" value={costs.travel} />
            <CostRow icon={Home} label={`Homestay (${Math.max(0, days - 1)} đêm)`} value={costs.stay} />
          </div>
          <div className="mt-5 flex items-end justify-between gap-4 rounded-2xl bg-primary p-5 text-primary-foreground">
            <div><p className="text-sm opacity-80">Tổng dự kiến</p><p className="mt-1 text-xs opacity-70">Cho {people} người, {days} ngày</p></div>
            <p className="text-right font-serif text-2xl font-semibold tabular-nums md:text-3xl">{money.format(costs.total)}</p>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5" /> Bình quân {money.format(Math.round(costs.total / people))} mỗi người</p>
        </div>
      </div>
    </section>
  );
}

const Control = ({ label, children }: { label: string; children: React.ReactElement }) => <label className="text-xs font-medium text-muted-foreground">{label}<div className="mt-1.5 [&>select]:w-full [&>select]:rounded-xl [&>select]:border [&>select]:border-border [&>select]:bg-background [&>select]:px-3 [&>select]:py-2.5 [&>select]:text-sm [&>select]:text-foreground [&>select]:outline-none [&>select]:focus:border-primary">{children}</div></label>;
const CostRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) => <div className="flex items-center gap-3 py-4 first:pt-0"><div className="grid h-9 w-9 place-items-center rounded-xl bg-mist text-primary"><Icon className="h-4 w-4" /></div><p className="flex-1 font-medium">{label}</p><p className="tabular-nums text-muted-foreground">{money.format(value)}</p></div>;
