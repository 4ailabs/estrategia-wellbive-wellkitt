let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch {
  puppeteer = require('../slides/node_modules/puppeteer');
}

const path = require('path');
const fs = require('fs');
const http = require('http');

const SCALE = 4;
const PAGE_W = 816;
const PAGE_H = 1056;
const PORT = 3013;

const BASE_DIR = __dirname;
const OUT_DIR = path.join(BASE_DIR, 'export_folletos');

const ARCHIVOS = [
  { archivo: 'folleto-dolor.html', carpeta: 'folleto-color' },
  { archivo: 'folleto-dolor-bn.html', carpeta: 'folleto-bn' },
];

(async () => {
  console.log('────────────────────────────────────────────────────────');
  console.log('Wellkitt Dolor — Exportacion Folletos a PNG');
  console.log(`Resolucion: ${PAGE_W * SCALE} x ${PAGE_H * SCALE} px por pagina (Letter, ${SCALE}x)`);
  console.log('────────────────────────────────────────────────────────\n');

  let browser;
  const server = http.createServer((req, res) => {
    if (!req.url || req.url.includes('favicon')) {
      res.writeHead(204);
      res.end();
      return;
    }

    const requestPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath;
    if (requestPath === '/' || requestPath === '/index.html') {
      filePath = path.join(BASE_DIR, 'folleto-dolor.html');
    } else {
      filePath = path.join(BASE_DIR, requestPath.replace(/^\/+/, ''));
      if (!fs.existsSync(filePath)) {
        filePath = path.join(BASE_DIR, '..', '..', '..', requestPath.replace(/^\/+/, ''));
      }
    }

    try {
      const content = fs.readFileSync(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const types = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
      };
      res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end('Not found: ' + requestPath);
    }
  });

  try {
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(PORT, resolve);
    });
    console.log(`  Servidor local en puerto ${PORT}\n`);

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
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

      const pageCount = await page.evaluate(() => document.querySelectorAll('.page').length);
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

        if (!box) {
          console.log(`  x pagina-${num} — no encontrada`);
          continue;
        }

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

    console.log('\n────────────────────────────────────────────────────────');
    console.log(`${totalExportados} paginas exportadas a ${OUT_DIR}`);
    console.log('────────────────────────────────────────────────────────');
  } finally {
    if (browser) {
      await browser.close();
    }
    await new Promise((resolve) => server.close(resolve));
  }
})();
