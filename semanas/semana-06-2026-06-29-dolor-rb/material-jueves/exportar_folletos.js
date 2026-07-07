#!/usr/bin/env node

/**
 * Exporta cada elemento `.page` de un folleto HTML como una imagen PNG Letter.
 *
 * Uso:
 *   npm run exportar
 *   npm run exportar -- otro-folleto.html export_folletos/otra-version
 *   npm run exportar -- otro-folleto.html export_folletos/otra-version --scale=3
 */

const fs = require('fs');
const http = require('http');
const path = require('path');
const puppeteer = require('puppeteer');

const BASE_DIR = __dirname;
const LETTER_WIDTH = 816;
const LETTER_HEIGHT = 1056;

const positionalArgs = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const scaleArg = process.argv.slice(2).find((arg) => arg.startsWith('--scale='));
const scale = scaleArg ? Number(scaleArg.split('=')[1]) : 4;
const inputName = positionalArgs[0] || 'folleto-dolor.html';
const outputName = positionalArgs[1] || path.join('export_folletos', 'folleto-color');
const inputPath = path.resolve(BASE_DIR, inputName);
const outputDir = path.resolve(BASE_DIR, outputName);

if (!Number.isFinite(scale) || scale < 1 || scale > 6) {
  console.error('Error: --scale debe ser un numero entre 1 y 6.');
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.error(`Error: no existe el archivo ${inputPath}`);
  process.exit(1);
}

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function createServer() {
  return http.createServer((req, res) => {
    if (!req.url || req.url.includes('favicon')) {
      res.writeHead(204);
      res.end();
      return;
    }

    const requestPath = decodeURIComponent(req.url.split('?')[0]);
    const relativePath = requestPath === '/' ? path.basename(inputPath) : requestPath.replace(/^\/+/, '');
    const candidates = [
      path.resolve(BASE_DIR, relativePath),
      path.resolve(BASE_DIR, '..', '..', '..', relativePath),
    ];
    const filePath = candidates.find((candidate) => fs.existsSync(candidate));

    if (!filePath) {
      res.writeHead(404);
      res.end(`Not found: ${requestPath}`);
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[extension] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
}

async function main() {
  const server = createServer();
  let browser;

  try {
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });

    const { port } = server.address();
    fs.mkdirSync(outputDir, { recursive: true });

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: LETTER_WIDTH,
      height: LETTER_HEIGHT,
      deviceScaleFactor: scale,
    });

    const url = `http://127.0.0.1:${port}/${encodeURIComponent(path.basename(inputPath))}`;
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);

    const pages = await page.$$('.page');
    if (pages.length === 0) {
      throw new Error('No se encontraron elementos con la clase `.page`.');
    }

    console.log(`Exportando ${pages.length} pagina(s) Letter a ${LETTER_WIDTH * scale} x ${LETTER_HEIGHT * scale} px`);

    for (let index = 0; index < pages.length; index += 1) {
      const number = String(index + 1).padStart(2, '0');
      const outputPath = path.join(outputDir, `pagina-${number}.png`);
      const size = await pages[index].evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return { width: Math.round(rect.width), height: Math.round(rect.height) };
      });

      if (size.width !== LETTER_WIDTH || size.height !== LETTER_HEIGHT) {
        console.warn(
          `Aviso: pagina ${number} mide ${size.width} x ${size.height} CSS px; Letter esperado: ${LETTER_WIDTH} x ${LETTER_HEIGHT}.`,
        );
      }

      await pages[index].screenshot({
        path: outputPath,
        type: 'png',
        omitBackground: false,
      });
      console.log(`Creado: ${outputPath}`);
    }
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(`Error al exportar: ${error.message}`);
  process.exitCode = 1;
});
