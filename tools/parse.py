"""Парсинг сайта: мета-теги, заголовки, текст, контакты, ссылки, цены.
python3 tools/parse.py <url> [--js] [--out=report.json]
--js — рендерить через Chromium (для сайтов на React/Vue/Tilda)."""
import json, re, sys
from urllib.parse import urljoin, urlparse

import httpx
import trafilatura
from selectolax.lexbor import LexborHTMLParser as HTMLParser

def fetch(url, js=False):
    if not url.startswith("http"):
        if js:
            from pathlib import Path
            url = Path(url).resolve().as_uri()
        else:
            return open(url, encoding="utf-8", errors="ignore").read()
    if js:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            b = p.chromium.launch(); pg = b.new_page()
            pg.goto(url, wait_until="networkidle", timeout=60000)
            html = pg.content(); b.close(); return html
    r = httpx.get(url, follow_redirects=True, timeout=30,
                  headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36"})
    r.raise_for_status(); return r.text

def analyze(url, html):
    t = HTMLParser(html)
    meta = lambda sel: (n.attributes.get("content") if (n := t.css_first(sel)) else None)
    text = trafilatura.extract(html, include_links=False) or ""
    host = urlparse(url).netloc
    links = {urljoin(url, a.attributes.get("href", "")) for a in t.css("a[href]")}
    return {
        "url": url,
        "title": t.css_first("title").text(strip=True) if t.css_first("title") else None,
        "description": meta('meta[name="description"]'),
        "og": {k: meta(f'meta[property="og:{k}"]') for k in ("title", "description", "image")},
        "headings": {h: [n.text(strip=True) for n in t.css(h)] for h in ("h1", "h2", "h3")},
        "phones": sorted(set(re.findall(r"(?:\+7|8)[\s(-]*\d{3}[\s)-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}", html))),
        "emails": sorted(set(re.findall(r"[\w.+-]+@[\w-]+\.[\w.]+", html)) - {""}),
        "prices": sorted(set(re.findall(r"\d[\d\s]{1,7}\s?(?:₽|руб)", text)))[:50],
        "social": sorted(l for l in links if re.search(r"vk\.com|t\.me|instagram|youtube|dzen|ok\.ru|wa\.me", l)),
        "internal_links": sorted(l for l in links if urlparse(l).netloc == host)[:200],
        "images": [urljoin(url, i.attributes.get("src", "")) for i in t.css("img[src]")][:100],
        "text": text,
    }

if __name__ == "__main__":
    a = [x for x in sys.argv[1:] if not x.startswith("--")]
    f = dict(x[2:].split("=", 1) if "=" in x else (x[2:], True) for x in sys.argv[1:] if x.startswith("--"))
    if not a: sys.exit(__doc__)
    rep = analyze(a[0], fetch(a[0], js=bool(f.get("js"))))
    out = json.dumps(rep, ensure_ascii=False, indent=2)
    if f.get("out"): open(f["out"], "w").write(out); print(f"✓ {f['out']}")
    else: print(out)
