import urllib.request, re, html, json, concurrent.futures
from pathlib import Path
urls={'palace':'https://www.dalatpalacehotel.com/en/engwelcome/','ana':'https://www.anamandara-resort.com/','cu-tren-cay':'https://dalat.vn/vi/csltcutrencay','legume':'https://visitlamdong.vn/vi/legume','lam-vien':'https://visitlamdong.vn/vi/quangtruonglamvien','dinh-iii':'https://dalat.vn/vi/dinhiii','cathedral':'https://dalat.vn/vi/nhathoconga','museum':'https://baotanglamdong.com.vn/'}
def fetch(pair):
 key,url=pair
 try:
  s=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=20).read().decode('utf-8',errors='replace')
  images=re.findall(r'<(?:meta|img)\b[^>]+>',s)
  picks=[x for x in images if 'og:image' in x] or [x for x in images if not any(t in x.lower() for t in ['logo','icon','flag','avatar'])][:10]
  return key,{'url':url,'images':picks}
 except Exception as e:return key,{'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool: result=dict(pool.map(fetch,urls.items()))
Path('scripts/catalog-photo-research.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
for k,v in result.items(): print(k, str(v)[:1800])
