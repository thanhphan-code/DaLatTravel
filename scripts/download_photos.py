import json, urllib.request, time
from pathlib import Path
candidates=json.loads(Path('scripts/photo-candidates.json').read_text(encoding='utf-8'))
selected={'xuan-huong-lake':0,'langbiang':0,'cau-dat':0,'datanla':0,'night-market':2,'domaine-de-marie':0,'tuyen-lam-lake':1,'truc-lam-pagoda':0,'crazy-house':2,'dalat-railway-station':0,'elephant-waterfall':0,'traimat':0,'linh-phuoc-pagoda':0,'dalat-flower-garden':1,'pongour-waterfall':0,'banh-can':0,'banh-trang-nuong':0,'coffee':1,'nem-nuong':2,'banh-beo':1}
credits={}
for key,index in selected.items():
 item=candidates[key][index]; path=Path('public/images/verified')/(key+'.jpg')
 try:
  if not path.exists():
   req=urllib.request.Request(item['url'],headers={'User-Agent':'DaLatTravel/1.0 educational website'})
   response=urllib.request.urlopen(req,timeout=30)
   if not response.headers.get('Content-Type','').startswith('image/'): raise ValueError('Not an image')
   path.write_bytes(response.read()); time.sleep(1)
  credits[key]={**item,'path':'/images/verified/'+key+'.jpg','checkedAt':'2026-11-21'}
  print(key,path.stat().st_size,flush=True)
 except Exception as e: print(key,str(e),flush=True)
Path('src/data/photoCredits.json').write_text(json.dumps(credits,ensure_ascii=False,indent=2),encoding='utf-8')
