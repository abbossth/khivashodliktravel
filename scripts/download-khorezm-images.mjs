/**
 * Downloads Khorezm / Khiva / Aral region photos from Wikimedia Commons (free licenses).
 * Run: node scripts/download-khorezm-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../public/images');
const UA = 'KhivaShodlikTravel/1.0 (https://github.com/shodlik-travel; image setup)';

const FILES = [
  { out: 'ayaz-kala.jpg', title: 'File:Ayaz Kala fortress Khorezm.JPG' },
  { out: 'ayaz-kala-oasis.jpg', title: 'File:Chorasmian oasis Ayaz-Kala fortress.jpg' },
  { out: 'toprak-kala.jpg', title: 'File:Toprak Kala (Khorezm, Ouzbékistan) (5609444698).jpg' },
  { out: 'aral-moynaq.jpg', title: 'File:Moynaq Aral-Sea Ships.jpg' },
  { out: 'khiva-kalta-minor.jpg', title: 'File:Kalta Minor 01.jpg' },
  { out: 'kunya-ark.jpg', title: 'File:Konya Ark towers (Цитадель Куня-Арк, Koʻhna ark), Itchan Kala, Khiva.jpg' },
  { out: 'toprak-kala-ruins.jpg', title: 'File:Ruins of Toprak-Kala.jpg' },
];

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function resolveUrl(title) {
  const params = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: '1280',
    format: 'json',
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { 'User-Agent': UA },
  });
  const data = await res.json();
  const page = Object.values(data.query.pages)[0];
  if (page.missing) throw new Error(`Missing: ${title}`);
  const info = page.imageinfo?.[0];
  return info?.thumburl || info?.url;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const { out, title } of FILES) {
    const dest = path.join(OUT_DIR, out);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 10_000) {
      console.log(`skip ${out} (exists)`);
      continue;
    }
    console.log(`fetch ${title} -> ${out}`);
    const url = await resolveUrl(title);
    await download(url, dest);
    console.log(`  saved ${(fs.statSync(dest).size / 1024).toFixed(0)} KB`);
    await sleep(2500);
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
