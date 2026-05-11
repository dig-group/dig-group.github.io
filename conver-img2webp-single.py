import sys
from pathlib import Path
from PIL import Image, ImageOps

def convert_to_webp(file_path, quality=74, max_side=1600):
    src = Path(file_path).resolve()
    
    # 验证文件是否存在且后缀是否支持
    extensions = {'.jpg', '.jpeg', '.png', '.gif'}
    if not src.exists() or src.suffix.lower() not in extensions:
        print(f"跳过：不支持的文件格式或文件不存在 -> {src}")
        return

    dst = src.with_suffix('.webp')
    
    try:
        with Image.open(src) as im:
            # 纠正方向
            im = ImageOps.exif_transpose(im)
            
            # 模式转换
            if im.mode not in ('RGB', 'RGBA'):
                im = im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
            
            # 缩放
            if max(im.size) > max_side:
                im.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
            
            # 保存参数
            save_kwargs = {'format': 'WEBP', 'quality': quality, 'method': 6}
            if im.mode == 'RGBA':
                save_kwargs['lossless'] = False
            
            im.save(dst, **save_kwargs)
            
            old_size = src.stat().st_size / 1024
            new_size = dst.stat().st_size / 1024
            print(f"转换成功: {src.name}")
            print(f"体积变化: {old_size:.1f}KB -> {new_size:.1f}KB (减少 {old_size - new_size:.1f}KB)")
            
    except Exception as e:
        print(f"转换失败 {src.name}: {e}")

if __name__ == "__main__":
    # python .\conver-img2webp-single.py .\image\research\transportation.png
    if len(sys.argv) < 2:
        print("用法: python convert.py <文件路径>")
    else:
        convert_to_webp(sys.argv[1])