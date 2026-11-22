import json,urllib.request,time
from pathlib import Path
p=Path('src/data/photoCredits.json'); credits=json.loads(p.read_text(encoding='utf-8')); candidates=json.loads(Path('scripts/photo-candidates.json').read_text(encoding='utf-8'))
for key,index in {'langbiang':1,'domaine-de-marie':1,'tuyen-lam-lake':0,'nem-nuong':0,'banh-beo':1}.items():
 time.sleep(3)
 item=candidates[key][index]
 try:
  r=urllib.request.urlopen(urllib.request.Request(item['url'],headers={'User-Agent':'DaLatTravel/1.0 educational website'}),timeout=30)
  Path('public/images/verified/'+key+'.jpg').write_bytes(r.read())
  credits[key]={**item,'path':'/images/verified/'+key+'.jpg','checkedAt':'2026-11-21'}; p.write_text(json.dumps(credits,ensure_ascii=False,indent=2),encoding='utf-8');print(key,'OK',flush=True)
 except Exception as e:print(key,str(e),flush=True)
