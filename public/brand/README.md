# Khiva Shodlik Travel — brand assets

## Official logo

| File | Use |
|------|-----|
| `khiva-shodlik-travel-logo.png` | **Primary** transparent emblem (512×512) |
| `logo-mark.png` | Same as primary (alias) |
| `favicon-16.png` / `favicon-32.png` | Browser tabs |
| `apple-touch-icon.png` | iOS home screen |
| `icon-512.png` | PWA |

Source: `assets/shodlik-travel-logo-source.jpg` — re-run processing after replacing:

```bash
python3 -m venv .venv-logo && .venv-logo/bin/pip install pillow
.venv-logo/bin/python scripts/process-brand-logo.py
```

## Legacy SVG

`logo-mark.svg` / `logo-full.svg` are kept for reference; the site uses the PNG emblem via `BrandLogo`.
