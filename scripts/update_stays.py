from pathlib import Path
p = Path(__file__).resolve().parent.parent / 'src/pages/Homestays.tsx'
s = p.read_text(encoding='utf-8-sig')
s = s.replace('Scale, Star, Users', 'Scale, Users')
s = s.replace('|| 0;', '|| null;')
s = s.replace('useState("rating")', 'useState("recommended")')
s = s.replace('  const [compare,', '  const [kind, setKind] = useState("all");\n  const [query, setQuery] = useState("");\n  const [compare,')
a = s.index('  const filtered =')
b = s.index('  const compared =', a)
s = s[:a] + '''  const filtered = useMemo(() => homestays
    .filter((item) => kind === "all" || (item.kind ?? "Homestay") === kind)
    .filter((item) => `${item.name} ${item.address}`.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi")))
    .filter((item) => maxPrice === "all" || (priceOf(item.price) !== null && priceOf(item.price)! <= Number(maxPrice)))
    .filter((item) => audience === "all" || item.suitableFor.toLocaleLowerCase("vi").includes(audience))
    .sort((a, b) => {
      if (sort === "recommended") return 0;
      const first = priceOf(a.price), second = priceOf(b.price);
      if (first === null) return second === null ? 0 : 1;
      if (second === null) return -1;
      return sort === "price-asc" ? first - second : second - first;
    }), [audience, maxPrice, sort, kind, query]);
''' + s[b:]
s = s.replace('Homestay tại Đà Lạt', 'Một nơi để ở. Một miền để nhớ.')
s = s.replace('Lọc theo nhu cầu và đặt tối đa ba nơi cạnh nhau để chọn dễ hơn.', 'Khách sạn bên hồ, resort giữa đồi thông hay một căn homestay nhỏ. So sánh tối đa ba nơi để tìm chỗ ở hợp chuyến đi của bạn.')
s = s.replace('    <section className="mt-8', '''    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2" role="group" aria-label="Loại lưu trú">{["all", "Khách sạn", "Homestay", "Resort"].map((value) => <button key={value} onClick={() => setKind(value)} aria-pressed={kind === value} className={`rounded-full border px-4 py-2 text-sm transition ${kind === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary"}`}>{value === "all" ? "Tất cả" : value}</button>)}</div><input aria-label="Tìm nơi lưu trú" placeholder="Tên nơi ở, đường phố…" value={query} onChange={(event) => setQuery(event.target.value)} className="rounded-xl border border-border bg-card px-4 py-3 text-sm sm:w-72" /></div>
    <section className="mt-5''')
s = s.replace('<option value="rating">Đánh giá cao nhất</option>', '<option value="recommended">Gợi ý khám phá</option>')
s = s.replace('</b> homestay', '</b> nơi lưu trú')
s = s.replace('    <div className="mt-8 flex items-center', '    <p className="mt-4 text-xs leading-6 text-muted-foreground">Giá có sẵn là mức tham khảo, cần xác nhận theo ngày và loại phòng. Nơi chưa công bố giá chỉ xuất hiện khi chọn tất cả mức giá.</p>\n    <div className="mt-8 flex items-center')
a = s.index('<span className="absolute top-4 right-4')
b = s.index('</span>', a) + len('</span>')
s = s[:a] + '<span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-primary">{item.kind ?? "Homestay"}</span>' + s[b:]
s = s.replace('<div className="p-6"><div', '<div className="p-6"><a href={item.imageSource} target="_blank" rel="noreferrer" className="mb-3 inline-block text-xs text-muted-foreground underline">Ảnh & thông tin nguồn</a><div')
s = s.replace('    <div className="mt-5 grid', '    {filtered.length === 0 && <div className="my-10 rounded-2xl bg-mist/40 p-8 text-center"><p>Chưa có nơi lưu trú phù hợp bộ lọc.</p><button onClick={() => { setKind("all"); setQuery(""); setAudience("all"); setMaxPrice("all"); }} className="mt-3 text-primary underline">Xóa bộ lọc</button></div>}\n    <div className="mt-5 grid')
s = s.replace('<p>Đánh giá</p>', '<p>Loại lưu trú</p>')
s = s.replace('<p>{item.rating} sao</p>', '<p>{item.kind ?? "Homestay"}</p>')
p.write_text(s, encoding='utf-8')
