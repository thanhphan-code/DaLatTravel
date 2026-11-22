"""Download published destination photos and retain their source pages."""
import json
import re
from pathlib import Path
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor

root = Path(__file__).resolve().parent.parent
research = json.loads((root / 'scripts/catalog-photo-research.json').read_text(encoding='utf-8-sig'))
ids = {'palace': 'dalat-palace', 'ana': 'ana-mandara', 'cu-tren-cay': 'cu-tren-cay', 'legume': 'legume', 'lam-vien': 'lam-vien-square', 'dinh-iii': 'bao-dai-palace', 'cathedral': 'dalat-cathedral'}
output = root / 'public/images/catalog'
output.mkdir(parents=True, exist_ok=True)

def download(pair):
    key, place_id = pair
    item = research[key]
    url = re.search(r'(?:src|content)="(https://[^"]+)"', item['images'][0]).group(1)
    suffix = '.png' if url.lower().endswith('.png') else '.jpg'
    with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=35) as response:
        if not response.headers.get('Content-Type', '').startswith('image/'):
            raise ValueError('Response is not an image')
        (output / (place_id + suffix)).write_bytes(response.read())
    print(place_id)
    return place_id, {'path': '/images/catalog/' + place_id + suffix, 'source': item['url'], 'imageUrl': url, 'publisher': 'Cổng du lịch Lâm Đồng' if 'visitlamdong' in item['url'] else 'Trang của cơ sở lưu trú'}

with ThreadPoolExecutor(max_workers=7) as pool:
    photos = dict(pool.map(download, ids.items()))
(root / 'src/data/catalogPhotos.json').write_text(json.dumps(photos, ensure_ascii=False, indent=2), encoding='utf-8')
