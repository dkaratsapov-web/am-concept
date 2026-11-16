// Рендер HTML-баннера в PNG под форматы VK Ads.
// node tools/banner.mjs <banner.html> [папка=banners] [--sizes=1x1,4x5,16x9,9x16]
// В HTML используйте 100vw/100vh — макет подстроится под каждый размер.
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { mkdirSync } from 'fs';
import { resolve, basename } from 'path';
import { pathToFileURL } from 'url';

const SIZES = {
  '1x1': [1080, 1080],   // квадрат — лента
  '4x5': [1080, 1350],   // вертикаль — лента
  '16x9': [1080, 607],   // горизонталь
  '9x16': [1080, 1920],  // истории / клипы
  '600': [600, 600],     // малый квадрат (иконка/логотип)
};
const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => a.slice(2).split('=')));
const [src, outDir = 'banners'] = args.filter(a => !a.startsWith('--'));
if (!src) { console.error('Использование: node tools/banner.mjs <banner.html> [папка] [--sizes=1x1,4x5]'); process.exit(1); }
const pick = (flags.sizes || '1x1,4x5,16x9,9x16').split(',');
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const key of pick) {
  const [width, height] = SIZES[key] || key.split('x').map(Number);
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(pathToFileURL(resolve(src)).href + `#${key}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const file = `${outDir}/${basename(src, '.html')}_${width}x${height}.png`;
  await page.screenshot({ path: file });
  console.log(`✓ ${file}`);
  await page.close();
}
await browser.close();
