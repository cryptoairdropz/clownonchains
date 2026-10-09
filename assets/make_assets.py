from PIL import Image, ImageDraw, ImageFont

# --- favicon.svg ---
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f6c68b"/>
      <stop offset="1" stop-color="#c97f2e"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#171009"/>
  <rect x="6" y="14" width="52" height="38" rx="8" fill="url(#g)"/>
  <circle cx="32" cy="33" r="11" fill="#241708" stroke="#fff7ea" stroke-width="3"/>
  <circle cx="32" cy="33" r="5" fill="#f0b35e"/>
  <path d="M32 20 C36 25 36 28 32 33" fill="none" stroke="#fff7ea" stroke-width="3"/>
  <path d="M32 46 C36 41 36 38 32 33" fill="none" stroke="#fff7ea" stroke-width="3"/>
  <path d="M32 46 C28 41 28 38 32 33" fill="none" stroke="#fff7ea" stroke-width="3"/>
</svg>'''
with open('/home/hermes/clown-portal/assets/favicon.svg', 'w') as f:
    f.write(svg)

# --- og cover (1200x630) ---
W, H = 1200, 630
base = Image.new('RGB', (W, H), '#100b06')
grad = Image.new('RGB', (W, H), '#171009')
gd = ImageDraw.Draw(grad)
for x in range(0, W, 2):
    t = x / W
    r = int(240 - 30 * t)
    g = int(179 - 40 * t)
    b = int(94 - 20 * t)
    gd.line([(x, 0), (x, H)], fill=(r, g, b))
img = Image.blend(base, grad, 0.5)
d = ImageDraw.Draw(img)

f_title = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf', 150)
f_sub = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 48)
f_med = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 36)

d.text((W // 2, H // 2 - 120), 'ClownOnChains', fill='#f6c68b', font=f_title, anchor='mm')
d.text((W // 2, H // 2 - 12), 'Web3 · Airdrop · Trading Bot', fill='#f0b35e', font=f_sub, anchor='mm')
d.text((W // 2, H // 2 + 120), 'Master the on-chain chaos — get the alpha before it fades.', fill='#c4b096', font=f_med, anchor='mm')

img.save('/home/hermes/clown-portal/assets/og-cover.png', quality=95, optimize=True)

# --- apple touch icon (180x180) ---
ic = Image.new('RGB', (180, 180), '#171009')
icd = ImageDraw.Draw(ic)
icd.rounded_rectangle([10, 20, 170, 160], radius=30, fill=(246, 198, 139))
icd.ellipse([78, 78, 102, 102], fill='#241708', outline=(255, 247, 234), width=6)
icd.ellipse([84, 84, 96, 96], fill=(240, 179, 94))
ic.save('/home/hermes/clown-portal/assets/apple-touch-icon.png', quality=95)

print('assets done')
