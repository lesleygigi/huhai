from pathlib import Path

from PIL import Image
from rembg import new_session, remove


ROOT = Path(__file__).resolve().parents[1]
RESAMPLE = Image.Resampling.LANCZOS


PORTRAITS = [
    {
        "src": ROOT / "image_temp/胡亥.jpg",
        "out": ROOT / "public/images/portraits/huhai/photo_cutout.png",
        "crop": (0, 0, 309, 392),
        "model": "birefnet-portrait",
        "height": 720,
        "top_margin": 0,
    },
    {
        "src": ROOT / "image_temp/赵高.jpg",
        "out": ROOT / "public/images/portraits/zhao_gao/photo_cutout.png",
        "crop": (130, 0, 500, 321),
        "model": "u2net",
        "height": 720,
        "top_margin": 0,
    },
    {
        "src": ROOT / "image_temp/李斯.jpg",
        "out": ROOT / "public/images/portraits/li_si/photo_cutout.png",
        "crop": (0, 0, 720, 611),
        "model": "birefnet-portrait",
        "height": 720,
        "top_margin": 0,
    },
]


def trim_alpha(image: Image.Image) -> Image.Image:
    bbox = image.getbbox()
    return image.crop(bbox) if bbox else image


def process_portrait(spec: dict[str, object]) -> None:
    source = Image.open(spec["src"]).convert("RGBA").crop(spec["crop"])
    cutout = remove(
        source,
        session=new_session(spec["model"]),
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=10,
        alpha_matting_erode_size=8,
    ).convert("RGBA")
    cutout = trim_alpha(cutout)

    target_height = spec["height"]
    top_margin = spec.get("top_margin", 0)
    scale = (target_height - top_margin) / cutout.height
    resized = cutout.resize(
        (round(cutout.width * scale), round(cutout.height * scale)),
        RESAMPLE,
    )
    canvas = Image.new(
        "RGBA",
        (resized.width, resized.height + top_margin),
        (0, 0, 0, 0),
    )
    canvas.alpha_composite(resized, (0, top_margin))

    spec["out"].parent.mkdir(parents=True, exist_ok=True)
    canvas.save(spec["out"], optimize=True)
    print(f"{spec['out'].relative_to(ROOT)} {canvas.size}")


def main() -> None:
    for portrait in PORTRAITS:
        process_portrait(portrait)


if __name__ == "__main__":
    main()
