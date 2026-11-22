import json, urllib.request, urllib.parse, re, html, time
from pathlib import Path
path=Path('scripts/photo-candidates.json'); data=json.loads(path.read_text(encoding='utf-8'))
queries={'langbiang':'Langbiang','crazy-house':'Hang Nga','valley-of-love':'Valley Love Dalat','van-thanh-flower-village':'Van Thanh Dalat','elephant-waterfall':'Elephant waterfall Vietnam','traimat':'Trai Mat','linh-phuoc-pagoda':'Linh Phuoc','dalat-flower-garden':'Dalat flower garden','clay-tunnel':'Dalat clay','pongour-waterfall':'Pongour','me-linh-coffee':'Me Linh coffee','fresh-garden':'Fresh Garden Dalat','banh-can':'Banh can','banh-mi-xiu-mai':'Banh mi xiu mai','banh-trang-nuong':'Banh trang nuong','coffee':'Vietnamese coffee','nem-nuong':'Nem nuong','banh-beo':'Banh beo'}
for key,query in queries.items():
 time.sleep(7)
 params=dict(action='query',generator='search',gsrsearch=query+' filetype:bitmap',gsrnamespace=6,gsrlimit=3,prop='imageinfo',iiprop='url|extmetadata',iiurlwidth=1280,format='json')
 try:
  req=urllib.request.Request('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params),headers={'User-Agent':'DaLatTravel/1.0 educational website'})
  body=json.load(urllib.request.urlopen(req,timeout=20)); items=[]
  for p in sorted(body.get('query',{}).get('pages',{}).values(),key=lambda x:x.get('index',0)):
   info=p['imageinfo'][0]; meta=info.get('extmetadata',{}); clean=lambda field: html.unescape(re.sub('<[^>]+>','',meta.get(field,{}).get('value','')))
   items.append(dict(title=p['title'],url=info.get('thumburl',info['url']),original=info['url'],source=info['descriptionurl'],author=clean('Artist'),license=clean('LicenseShortName'),licenseUrl=clean('LicenseUrl'),description=clean('ImageDescription'),date=clean('DateTimeOriginal')))
  data[key]=items; path.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8'); print(key,[(i['title'],i['license']) for i in items],flush=True)
 except Exception as e: print(key,str(e),flush=True)
