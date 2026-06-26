const puppeteer = require('puppeteer');
const path      = require('path');
const fs        = require('fs');
const http      = require('http');

const SCALE = 4;
const SLIDE_W = 1280;
const SLIDE_H = 720;
const PORT = 3011;

const HTML_FILE = path.join(__dirname, 'jueves-wellkitt-energia-slides.html');
const OUT_DIR   = path.join(__dirname, 'export_imagenes');

(async () => {
  console.log('────────────────────────────────────────────────────────');
  console.log('Jueves Wellkitt Energia — Exportacion Slides a PNG');
  console.log('────────────────────────────────────────────────────────\n');

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const server = http.createServer((req, res) => {
    if (req.url.includes('favicon')) {
      res.writeHead(204);
      res.end();
      return;
    }
    const filePath = path.join(__dirname, 'jueves-wellkitt-energia-slides.html');
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
  });
  server.listen(PORT);
  console.log(`  Servidor local en puerto ${PORT}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: SCALE });

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0', timeout: 30000 });

  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 2000));

  const slideCount = await page.evaluate(() =>
    document.querySelectorAll('.slide').length
  );
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
    console.log(`  slide-${num}.png  —  ${pxW} x ${pxH} px`);
  }

  await browser.close();
  server.close();

  console.log(`\n────────────────────────────────────────────────────────`);
  console.log(`${slideCount} slides exportados a ${OUT_DIR}`);
  console.log('────────────────────────────────────────────────────────');
})();
