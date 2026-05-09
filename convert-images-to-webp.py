from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path('.').resolve()
IMAGE_ROOT = ROOT / 'image'
QUALITY = 74
MAX_SIDE = 1600

extensions = {'.jpg', '.jpeg', '.png', '.gif'}
converted = []
skipped = []

for src in IMAGE_ROOT.rglob('*'):
    if src.suffix.lower() not in extensions:
        continue
    dst = src.with_suffix('.webp')
    try:
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im)
            if im.mode not in ('RGB', 'RGBA'):
                im = im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
            if max(im.size) > MAX_SIDE:
                im.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)
            save_kwargs = {'format': 'WEBP', 'quality': QUALITY, 'method': 6}
            if im.mode == 'RGBA':
                save_kwargs['lossless'] = False
            im.save(dst, **save_kwargs)
        converted.append((src, dst, src.stat().st_size, dst.stat().st_size))
    except Exception as exc:
        skipped.append((src, str(exc)))

print(f'converted={len(converted)} skipped={len(skipped)}')
for src, dst, old, new in sorted(converted, key=lambda item: item[2] - item[3], reverse=True)[:20]:
    print(f'{old/1024:.1f}KB -> {new/1024:.1f}KB  {src.relative_to(ROOT)}')
if skipped:
    print('skipped:')
    for src, exc in skipped[:20]:
        print(src.relative_to(ROOT), exc)
