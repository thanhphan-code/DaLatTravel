import urllib.request,re,json,html,urllib.parse
from pathlib import Path
urls={'palace':'https://www.dalatpalacehotel.com/en/engwelcome/','cu-tren-cay':'https://visitlamdong.vn/vi/csltcutrencay','dinh-iii':'https://visitlamdong.vn/vi/dinhiii','cathedral':'https://visitlamdong.vn/vi/nhathoconga','museum':'https://visitlamdong.vn/vi/baotanglamdong','legume':'https://visitlamdong.vn/vi/legume'}
p=Path('scripts/catalog-photo-research.json'); results=json.loads(p.read_text(encoding='utf-8'))
for key,url in urls.items():
 try:
  s=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=15).read().decode('utf-8',errors='replace')
  tags=re.findall(r'<meta\b[^>]*property=[\"\']og:image[\"\'][^>]*>',s)
  if not tags:tags=[t for t in re.findall(r'<img\b[^>]*>',s) if 'uploads' in t][:5]
  results[key]={'url':url,'images':tags}
  print(key,str(tags)[:1800])
  if key=='legume': print(re.sub('<[^>]+>',' ',s)[-12000:-3000][-2000:])
 except Exception as e:print(key,str(e))
p.write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
