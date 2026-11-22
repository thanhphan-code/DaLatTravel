from pathlib import Path
root = Path(__file__).resolve().parent.parent
def edit(name, old, new):
    p = root / name
    s = p.read_text(encoding='utf-8-sig')
    assert old in s, (name, old[:70])
    p.write_text(s.replace(old, new), encoding='utf-8')

edit('src/data/catalogExpansion.ts', 'import lauGa', 'import catalogPhotos from "./catalogPhotos.json";\nimport lauGa')
edit('src/data/catalogExpansion.ts', 'export const additionalStays: Homestay[]', 'const stayEntries: Homestay[]')
p = root / 'src/data/catalogExpansion.ts'
p.write_text(p.read_text(encoding='utf-8') + '\nexport const additionalStays = stayEntries.map((stay) => ({ ...stay, image: (catalogPhotos as Record<string, { path: string }>)[stay.id]?.path ?? "/images/photo-pending.svg" }));\n', encoding='utf-8')
edit('src/data/catalogExpansion.ts', 'Đà Lạt · xem vị trí từ cơ sở lưu trú', '29 Bạch Đằng, Đà Lạt')
edit('src/data/catalogExpansion.ts', 'https://dalat.vn/vi/dinhiii', 'https://visitlamdong.vn/vi/dinhiii')
edit('src/data/catalogExpansion.ts', 'https://dalat.vn/iv/banhuottrang/bookingres', 'https://visitlamdong.vn/vi/banhuottrang')
edit('src/data/dalat.ts', 'const verifiedPhotos: Record<string, { path: string }> = photoCredits;', 'const verifiedPhotos: Record<string, { path: string }> = { ...photoCredits, ...catalogPhotos };')
edit('src/data/dalat.ts', 'import { additionalPlaces', 'import catalogPhotos from "./catalogPhotos.json";\nimport { additionalPlaces')
edit('src/pages/Index.tsx', '<section className="home-section" aria-labelledby="experience-title">', '<DalatMoodPicker />\n          <section className="home-section" aria-labelledby="experience-title">')
edit('src/components/PhotoCredit.tsx', 'import photos', 'import catalogPhotos from "@/data/catalogPhotos.json";\nimport photos')
edit('src/components/PhotoCredit.tsx', '  const photo = (', '''  const catalog = (catalogPhotos as Record<string, { source: string; publisher: string }>)[id];
  if (catalog) return <p className="mt-2 text-xs leading-5 text-muted-foreground">Ảnh công bố bởi <a href={catalog.source} target="_blank" rel="noreferrer" className="underline">{catalog.publisher}</a> · <Link to="/sources" className="underline">Thông tin ảnh</Link></p>;
  const photo = (''')
edit('src/pages/Sources.tsx', 'import credits', 'import catalogPhotos from "@/data/catalogPhotos.json";\nimport credits')
edit('src/pages/Sources.tsx', 'import { places }', 'import { places, homestays, foods }')
edit('src/pages/Sources.tsx', '        <section className="mt-12">', '''        <section className="mt-12">
          <h2 className="font-serif text-3xl">Ảnh từ điểm đến & cơ sở lưu trú</h2>
          <p className="mt-3 text-sm text-muted-foreground">Ảnh công bố trên trang của cơ sở và cổng du lịch Lâm Đồng. Quyền ảnh thuộc chủ sở hữu tại nguồn; không thuộc bộ ảnh Wikimedia bên dưới.</p>
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(catalogPhotos).map(([id, photo]) => <article key={id} className="overflow-hidden rounded-2xl border border-border"><img src={photo.path} alt={[...places, ...homestays, ...foods].find((item) => item.id === id)?.name ?? id} loading="lazy" className="aspect-[4/3] w-full object-cover" /><div className="p-4"><h3 className="font-semibold">{[...places, ...homestays, ...foods].find((item) => item.id === id)?.name ?? id}</h3><a href={photo.source} target="_blank" rel="noreferrer" className="mt-2 block text-sm text-primary underline">{photo.publisher}</a></div></article>)}</div>
        </section>
        <section className="mt-12">''')
edit('src/pages/Food.tsx', '                  {f.address && (', '''                  {f.sourceUrl && <a href={f.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs text-primary underline">Nguồn thông tin quán</a>}
                  {f.address && (''')
edit('src/pages/PlaceDetail.tsx', '<PhotoCredit id={place.id} />', '<PhotoCredit id={place.id} />\n        {place.sourceUrl && <a href={place.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-primary underline">Thông tin từ điểm đến</a>}')
