// Скриншоты страницы: десктоп + мобильный, во всю высоту.
// node tools/shot.mjs <url|файл.html> [папка=shots] [--dpr=1]
import { createRequire } from 'module';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
import { mkdirSync } from 'fs';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => a.slice(2).split('=')));
const [target, outDir = 'shots'] = args.filter(a => !a.startsWith('--'));
if (!target) { console.error('Использование: node tools/shot.mjs <url|файл.html> [папка] [--dpr=2]'); process.exit(1); }
const url = /^https?:/.test(target) ? target : pathToFileURL(resolve(target)).href;
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const profiles = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: Number(flags.dpr || 1) },
  mobile: devices['iPhone 13'],
};
for (const [name, ctxOpts] of Object.entries(profiles)) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  // прокрутка, чтобы сработали lazy-load и анимации появления
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
  const file = `${outDir}/${name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log(`✓ ${file}${errors.length ? `  (ошибки JS: ${errors.length})\n   ` + errors.slice(0, 5).join('\n   ') : ''}`);
  await ctx.close();
}
await browser.close();
