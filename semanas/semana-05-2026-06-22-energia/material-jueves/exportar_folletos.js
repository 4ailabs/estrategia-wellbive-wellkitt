const puppeteer = require('puppeteer');
const path      = require('path');
const fs        = require('fs');
const http      = require('http');

const SCALE = 4;
const PAGE_W = 816;   // 8.5in (Letter) en px CSS a 96dpi
const PAGE_H = 1056;  // 11in (Letter) en px CSS a 96dpi
const PORT = 3012;

const BASE_DIR = __dirname;
const OUT_DIR  = path.join(BASE_DIR, 'export_folletos');

const ARCHIVOS = [
  { archivo: 'folleto-energia.html',    carpeta: 'folleto-color' },
  { archivo: 'folleto-energia-bn.html', carpeta: 'folleto-bn' },
];

(async () => {
  console.log('────────────────────────────────────────────────────────');
  console.log('Wellkitt Energia — Exportacion Folletos a PNG');
  console.log(`Resolucion: ${PAGE_W * SCALE} x ${PAGE_H * SCALE} px por pagina (A4, ${SCALE}x)`);
  console.log('────────────────────────────────────────────────────────\n');

  const server = http.createServer((req, res) => {
    if (req.url.includes('favicon')) { res.writeHead(204); res.end(); return; }
    let filePath;
    if (req.url === '/' || req.url === '/index.html') {
      filePath = path.join(BASE_DIR, 'folleto-energia.html');
    } else {
      filePath = path.join(BASE_DIR, '..', '..', '..', req.url);
      if (!fs.existsSync(filePath)) {
        filePath = path.join(BASE_DIR, req.url);
      }
    }
    try {
      const content = fs.readFileSync(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const types = { '.html': 'text/html', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.css': 'text/css' };
      res.writeHead(200, { 'Content-Type': (types[ext] || 'application/octet-stream') + '; charset=utf-8' });
      res.end(content);
    } catch (e) {
      res.writeHead(404);
      res.end('Not found: ' + req.url);
    }
  });
  server.listen(PORT);
  console.log(`  Servidor local en puerto ${PORT}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let totalExportados = 0;

  for (const { archivo, carpeta } of ARCHIVOS) {
    const outDir = path.join(OUT_DIR, carpeta);
    fs.mkdirSync(outDir, { recursive: true });

    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 1400, deviceScaleFactor: SCALE });

    const fullUrl = `http://localhost:${PORT}/${archivo}`;
    console.log(`  ${archivo}`);
    await page.goto(fullUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 2000));

    const pageCount = await page.evaluate(() =>
      document.querySelectorAll('.page').length
    );
    console.log(`  Paginas detectadas: ${pageCount}`);

    for (let i = 0; i < pageCount; i++) {
      const num = String(i + 1).padStart(2, '0');
      const outPath = path.join(outDir, `pagina-${num}.png`);

      const box = await page.evaluate((idx) => {
        const el = document.querySelectorAll('.page')[idx];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      }, i);

      if (!box) { console.log(`  x pagina-${num} — no encontrada`); continue; }

      await page.screenshot({
        path: outPath,
        clip: { x: box.x, y: box.y, width: box.width, height: box.height },
        omitBackground: false,
      });

      const pxW = Math.round(box.width * SCALE);
      const pxH = Math.round(box.height * SCALE);
      console.log(`  pagina-${num}.png  —  ${pxW} x ${pxH} px`);
      totalExportados++;
    }

    await page.close();
  }

  await browser.close();
  server.close();

  console.log(`\n────────────────────────────────────────────────────────`);
  console.log(`${totalExportados} paginas exportadas a ${OUT_DIR}`);
  console.log('────────────────────────────────────────────────────────');
})();
