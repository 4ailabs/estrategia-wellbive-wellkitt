from pathlib import Path
from PIL import Image

ASSET_DIR = Path(__file__).parent / "assets-slides"

for source in sorted(ASSET_DIR.glob("producto-*-v2.png")):
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    box = alpha.point(lambda value: 255 if value > 8 else 0).getbbox()
    if box is None:
        raise RuntimeError(f"No visible content in {source}")
    left, top, right, bottom = box
    padding = max(20, int(max(right - left, bottom - top) * 0.025))
    crop_box = (
        max(0, left - padding),
        max(0, top - padding),
        min(image.width, right + padding),
        min(image.height, bottom + padding),
    )
    image.crop(crop_box).save(source, optimize=True)
    print(f"{source.name}: {image.size} -> {image.crop(crop_box).size}")
