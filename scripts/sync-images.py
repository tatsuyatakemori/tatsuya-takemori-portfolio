"""Cache declared portfolio images as WebP. Run manually; requires requests and Pillow."""
import concurrent.futures
import io
import json
from pathlib import Path
import subprocess
import requests
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
data = json.loads(subprocess.check_output(
    ['node', '-e', "global.window={};require('./data.js');process.stdout.write(JSON.stringify(window.PORTFOLIO_DATA))"],
    cwd=ROOT, encoding='utf-8'))
out = ROOT / 'assets' / 'thumbnails'
out.mkdir(parents=True, exist_ok=True)
manifest_path = ROOT / 'assets' / 'images.json'
previous = json.loads(manifest_path.read_text(encoding='utf-8')) if manifest_path.exists() else {}
jobs = [(w['id'], w['thumbnail'], w['link'], w.get('imageCredit', '')) for w in data['works']]
for w in data['researchWorks']:
    for m in w.get('media', []):
        if m['kind'] == 'youtube':
            jobs.append((m['id'], f"https://i.ytimg.com/vi/{m['id']}/hqdefault.jpg", f"https://www.youtube.com/watch?v={m['id']}", 'YouTube video thumbnail'))

def fetch(job):
    key, source, page, credit = job
    if source.startswith('assets/thumbnails/'):
        source = previous[key]['source']
    if key in previous and previous[key]['source'] == source and (ROOT / previous[key]['path']).exists():
        with Image.open(ROOT / previous[key]['path']) as cached:
            cached.verify()
        return key, {**previous[key], 'page': page, 'credit': credit}
    if source.startswith('https://'):
        r = requests.get(source, timeout=30)
        r.raise_for_status()
        blob = r.content
    else:
        blob = (ROOT / source).read_bytes()
    with Image.open(io.BytesIO(blob)) as original:
        im = ImageOps.exif_transpose(original).convert('RGB')
        im.thumbnail((1200, 900))
        path = out / f'{key}.webp'
        im.save(path, 'WEBP', quality=85, method=6)
        record = {'source': source, 'page': page, 'credit': credit, 'path': path.relative_to(ROOT).as_posix(), 'width': im.width, 'height': im.height, 'bytes': path.stat().st_size}
    return key, record

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    manifest = dict(pool.map(fetch, jobs))
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
source_text = (ROOT / 'data.js').read_text(encoding='utf-8')
for w in data['works']:
    source_text = source_text.replace('thumbnail: ' + json.dumps(w['thumbnail'], ensure_ascii=False), 'thumbnail: ' + json.dumps(manifest[w['id']]['path']))
(ROOT / 'data.js').write_text(source_text, encoding='utf-8')
print(f"Saved and decoded {len(manifest)} images; {sum(x['bytes'] for x in manifest.values()):,} bytes total.")
