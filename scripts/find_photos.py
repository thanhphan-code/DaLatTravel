import concurrent.futures, json, urllib.request, urllib.parse, re, html
from pathlib import Path
queries = {
'xuan-huong-lake':'Xuan Huong Lake', 'langbiang':'Lang Biang mountain landscape', 'cau-dat':'Cau Dat tea', 'datanla':'Datanla waterfall', 'night-market':'Da Lat night market', 'domaine-de-marie':'Domaine de Marie Dalat', 'tuyen-lam-lake':'Tuyen Lam Lake', 'truc-lam-pagoda':'Truc Lam monastery Dalat', 'crazy-house':'Hang Nga guesthouse exterior', 'dalat-railway-station':'Da Lat railway station facade', 'valley-of-love':'Valley of Love Dalat', 'van-thanh-flower-village':'Van Thanh flower Dalat', 'elephant-waterfall':'Elephant waterfall Vietnam', 'traimat':'Trai Mat Dalat', 'linh-phuoc-pagoda':'Linh Phuoc Pagoda', 'dalat-flower-garden':'Dalat flower garden', 'clay-tunnel':'Dalat clay tunnel', 'pongour-waterfall':'Pongour waterfall', 'me-linh-coffee':'Me Linh coffee', 'fresh-garden':'Fresh Garden Dalat', 'banh-can':'Banh can', 'banh-mi-xiu-mai':'Banh mi xiu mai', 'banh-trang-nuong':'Banh trang nuong', 'coffee':'Vietnamese coffee', 'lau-ga':'Lau ga la e', 'nem-nuong':'Nem nuong', 'kem-bo':'Kem bo', 'banh-beo':'Banh beo', 'suadau':'Soy milk Vietnam', 'grilled':'Vietnam grilled skewers', 'atiso':'Artichoke tea Vietnam', 'lau-bo':'Vietnam beef hot pot'}
def fetch(pair):
    key, query = pair
    params = dict(action='query',generator='search',gsrsearch=query+' filetype:bitmap',gsrnamespace=6,gsrlimit=4,prop='imageinfo',iiprop='url|extmetadata',iiurlwidth=1280,format='json')
    try:
        req=urllib.request.Request('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params),headers={'User-Agent':'DaLatTravel/1.0 educational website'})
        data=json.load(urllib.request.urlopen(req,timeout=30))
        items=[]
        for p in sorted(data.get('query',{}).get('pages',{}).values(),key=lambda x:x.get('index',0)):
            info=p['imageinfo'][0]; meta=info.get('extmetadata',{})
            clean=lambda field: html.unescape(re.sub('<[^>]+>','',meta.get(field,{}).get('value','')))
            items.append(dict(title=p['title'],url=info.get('thumburl',info['url']),original=info['url'],source=info['descriptionurl'],author=clean('Artist'),license=clean('LicenseShortName'),licenseUrl=clean('LicenseUrl'),description=clean('ImageDescription'),date=clean('DateTimeOriginal')))
        return key,items
    except Exception as e: return key,dict(error=str(e))
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool: results=dict(pool.map(fetch,queries.items()))
Path('scripts/photo-candidates.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
for k,v in results.items(): print(k,':', [(i['title'],i['license']) for i in v] if isinstance(v,list) else v)
