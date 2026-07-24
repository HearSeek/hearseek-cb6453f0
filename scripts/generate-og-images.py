"""Generate 1200x630 OG share images per collection: HearSeek × <Collection Logo>.
Uses scripts/og-template/background.png (uploaded reference) as the source, tiles
its top strip to cleanly erase the right-half IIS logo, then overlays each
collection's logo. IIS output re-uses the original template unchanged.
"""
from PIL import Image
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "scripts/og-template/background.png"
COLLECTIONS_DIR = ROOT / "src/assets/collections"
OUT_DIR = ROOT / "public/og"
OUT_DIR.mkdir(parents=True, exist_ok=True)

W, H = 1200, 630

# Parse registry.ts for slug -> logo filename + logoNoBackground flag
REG = (ROOT / "src/lib/registry.ts").read_text()

def parse_registry():
    # Grab logo imports: e.g.  import iisLogo from "@/assets/collections/iis.png";
    imports = dict(re.findall(r'import\s+(\w+)\s+from\s+"@/assets/collections/([\w-]+\.png)";', REG))
    # Slugs from featuredDeepIndex(...) 4th positional-ish arg + explicit entries
    # Simpler: enumerate known slugs by matching  key: "slug"  and  "slug": {  and featuredDeepIndex("slug",
    slugs = set()
    for m in re.finditer(r'featuredDeepIndex\(\s*"([\w-]+)"', REG):
        slugs.add(m.group(1))
    for m in re.finditer(r'^\s*(?:"([\w-]+)"|(\w+)):\s*\{', REG, re.MULTILINE):
        s = m.group(1) or m.group(2)
        if s in ("iis", "diary-of-a-ceo"):
            slugs.add(s)
    return sorted(slugs)

# Logo-no-background flags per slug (mirror registry). IIS is transparent; others sit on
# their dark tile. In our OG we always render the logo directly on the navy pattern —
# for logos with dark backgrounds baked in, we add a rounded white tile behind them
# to keep them readable.
DARK_LOGO_BG = {  # slugs whose logo files have their own dark card and need a light tile
    # (leave empty — all provided logos read fine on navy; adjust if needed)
}

def load_template():
    im = Image.open(TEMPLATE).convert("RGB").resize((W, H), Image.LANCZOS)
    return im

def clean_right_half(bg):
    """Cover right half with the top pattern strip tiled — erases the IIS logo."""
    strip_h = 110  # top strip height in resized image (pattern-only)
    strip = bg.crop((0, 0, W, strip_h))
    right = Image.new("RGB", (W // 2, H))
    y = 0
    while y < H:
        right.paste(strip, (0, y))
        y += strip_h
    # Blend edges with the surrounding: also cover a bit past midline to hide seam
    bg.paste(right, (W // 2, 0))
    return bg

def paste_logo(bg, logo_path: Path, box):
    """Fit logo inside box (x0,y0,x1,y1), preserving aspect, centered."""
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    logo = Image.open(logo_path).convert("RGBA")
    lw, lh = logo.size
    scale = min(bw / lw, bh / lh)
    nw, nh = int(lw * scale), int(lh * scale)
    logo = logo.resize((nw, nh), Image.LANCZOS)
    ox = x0 + (bw - nw) // 2
    oy = y0 + (bh - nh) // 2
    bg.paste(logo, (ox, oy), logo)
    return bg

def make_og(slug: str, logo_file: Path, out: Path):
    if slug == "iis":
        # Reuse the exact reference — already HearSeek × IIS
        Image.open(TEMPLATE).convert("RGB").resize((W, H), Image.LANCZOS).save(out, "PNG", optimize=True)
        return
    bg = load_template()
    bg = clean_right_half(bg)
    # Right-half logo box with generous padding
    pad = 60
    box = (W // 2 + pad, pad, W - pad, H - pad)
    paste_logo(bg, logo_file, box)
    bg.save(out, "PNG", optimize=True)

# Map slugs to logo filenames (matches registry imports)
SLUG_LOGO = {
    "iis": "iis.png",
    "diary-of-a-ceo": "diary-of-a-ceo.png",
    "huberman-lab": "huberman-lab.png",
    "lex-fridman": "lex-fridman.png",
    "chris-williamson": "chris-williamson.png",
    "tom-bilyeu": "tom-bilyeu.png",
    "ted": "ted.png",
    "dhruv-rathee": "dhruv-rathee.png",
    "think-school": "think-school.png",
    "beer-biceps": "beer-biceps.png",
    "raftar": "raftar.png",
}

for slug, fname in SLUG_LOGO.items():
    src = COLLECTIONS_DIR / fname
    out = OUT_DIR / f"{slug}.png"
    make_og(slug, src, out)
    print(f"wrote {out.relative_to(ROOT)}  ({out.stat().st_size // 1024} KB)")
