# Инструменты

| Скрипт | Что делает |
|---|---|
| `node tools/shot.mjs <url|файл.html> [папка] [--dpr=2]` | Скриншоты страницы во всю высоту: десктоп 1440px + iPhone 13, плюс ошибки JS из консоли |
| `node tools/banner.mjs <banner.html> [папка] [--sizes=1x1,4x5,16x9,9x16]` | Рендер HTML-баннера в PNG под форматы VK Ads: 1080×1080, 1080×1350, 1080×607, 1080×1920 |
| `python3 tools/parse.py <url|файл.html> [--js] [--out=report.json]` | Парсинг сайта: title/description/OG, H1–H3, телефоны, e-mail, цены, соцсети, ссылки, картинки, чистый текст. `--js` рендерит страницу через Chromium (React/Tilda) |

Баннер верстается в HTML с размерами в `vw`/`vh`, тогда один макет корректно подстраивается под все форматы.
Нужны: Node 22 + Playwright (уже установлен глобально), Python-пакеты `httpx trafilatura selectolax playwright`.
