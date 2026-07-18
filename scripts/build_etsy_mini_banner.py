from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
WIDTH = 1600
HEIGHT = 213


def lerp(a: int, b: int, t: float) -> int:
    return round(a + (b - a) * t)


def build_background() -> Image.Image:
    image = Image.new("RGB", (WIDTH, HEIGHT))
    pixels = image.load()

    left = (6, 27, 51)
    right = (9, 31, 53)
    bottom_shift = (3, 6, 10)

    for y in range(HEIGHT):
        vertical = y / max(HEIGHT - 1, 1)
        for x in range(WIDTH):
            horizontal = x / max(WIDTH - 1, 1)
            pixels[x, y] = tuple(
                max(0, lerp(left[channel], right[channel], horizontal) - round(bottom_shift[channel] * vertical))
                for channel in range(3)
            )

    return image.convert("RGBA")


def add_product_scene(canvas: Image.Image) -> None:
    source = Image.open(ROOT / "images/etsy/shop/mini-banner-product-scene.png").convert("RGBA")
    crop = source.crop((1320, 70, 2045, 769))
    target_height = 274
    target_width = round(crop.width * target_height / crop.height)
    crop = crop.resize((target_width, target_height), Image.Resampling.LANCZOS)

    mask = Image.new("L", crop.size, 255)
    mask_pixels = mask.load()
    feather_width = 95
    for x in range(min(feather_width, mask.width)):
        alpha = round(255 * (x / feather_width) ** 1.7)
        for y in range(mask.height):
            mask_pixels[x, y] = alpha

    canvas.paste(crop, (1268, -31), mask)


def add_branding(canvas: Image.Image) -> None:
    logo = Image.open(ROOT / "logo-header.png").convert("RGBA")
    logo_height = 180
    logo_width = round(logo.width * logo_height / logo.height)
    logo = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
    canvas.alpha_composite(logo, (52, 16))

    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((618, 95, 628, 105), radius=3, fill="#22D3EE")

    font_path = Path("/System/Library/Fonts/Supplemental/Andale Mono.ttf")
    font = ImageFont.truetype(str(font_path), 17)
    draw.text(
        (646, 91),
        "USEFUL PARTS  •  CUSTOM PRINTS  •  UNIQUE GIFTS",
        font=font,
        fill="#94A3B8",
    )

    draw.line((618, 195, 1245, 195), fill=(34, 211, 238, 100), width=1)


def main() -> None:
    canvas = build_background()
    add_product_scene(canvas)
    add_branding(canvas)

    output = ROOT / "images/etsy/shop/robinson-printworks-etsy-mini-banner.png"
    canvas.convert("RGB").save(output, format="PNG", optimize=True)
    print(output)


if __name__ == "__main__":
    main()
