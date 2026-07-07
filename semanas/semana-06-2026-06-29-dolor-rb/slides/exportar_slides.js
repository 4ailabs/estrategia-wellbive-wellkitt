const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const http = require('http');

const SCALE = 4;
const SLIDE_W = 1280;
const SLIDE_H = 720;
const PORT = 3012;
const HTML_FILE = path.join(__dirname, 'jueves-wellkitt-dolor-slides.html');
const OUT_DIR = path.join(__dirname, 'export_imagenes');

(async () => {
  console.log('────────────────────────────────────────────────────────');
  console.log('Jueves Wellkitt Dolor — Exportacion Slides a PNG');
  console.log('────────────────────────────────────────────────────────\n');

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let browser;
  const server = http.createServer((req, res) => {
    if (!req.url || req.url.includes('favicon')) {
      res.writeHead(204);
      res.end();
      return;
    }

    const requestPath = decodeURIComponent(req.url.split('?')[0]);
    const normalizedPath = requestPath === '/' ? HTML_FILE : path.join(__dirname, requestPath.replace(/^\/+/, ''));

    if (!normalizedPath.startsWith(__dirname)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    if (!fs.existsSync(normalizedPath) || !fs.statSync(normalizedPath).isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(normalizedPath).toLowerCase();
    const contentType = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
    }[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(normalizedPath).pipe(res);
  });

  try {
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(PORT, resolve);
    });
    console.log(`  Servidor local en puerto ${PORT}\n`);

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: SCALE });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 2000));

    const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
    console.log(`  Slides detectados: ${slideCount}\n`);

    for (let i = 0; i < slideCount; i++) {
      const num = String(i + 1).padStart(2, '0');
      const outPath = path.join(OUT_DIR, `slide-${num}.png`);
      const box = await page.evaluate((idx) => {
        const el = document.querySelectorAll('.slide')[idx];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      }, i);

      if (!box) {
        console.log(`  x slide-${num} — no encontrado`);
        continue;
      }

      await page.screenshot({
        path: outPath,
        clip: { x: box.x, y: box.y, width: box.width, height: box.height },
        omitBackground: false,
      });

      const pxW = Math.round(box.width * SCALE);
      const pxH = Math.round(box.height * SCALE);
      const sizeLabel = `${pxW} x ${pxH} px`;
      const expectedLabel = `${SLIDE_W * SCALE} x ${SLIDE_H * SCALE} px`;
      const suffix = sizeLabel === expectedLabel ? '' : `  (esperado ${expectedLabel})`;
      console.log(`  slide-${num}.png  —  ${sizeLabel}${suffix}`);
    }

    console.log('\n────────────────────────────────────────────────────────');
    console.log(`${slideCount} slides exportados a ${OUT_DIR}`);
    console.log('────────────────────────────────────────────────────────');
  } finally {
    if (browser) {
      await browser.close();
    }
    await new Promise((resolve) => server.close(resolve));
  }
})();
