#!/usr/bin/env node

const path = require('path');
const { pathToFileURL } = require('url');

const html = path.resolve(__dirname, 'slides-jueves-detox.html');

(async () => {
  const puppeteerPath = path.resolve(__dirname, '../../semana-06-2026-06-29-dolor-rb/slides/node_modules/puppeteer/lib/puppeteer/puppeteer.js');
  const { default: puppeteer } = await import(pathToFileURL(puppeteerPath).href);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--allow-file-access-from-files', '--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    page.on('console', (msg) => console.log('PAGE:', msg.text()));
    await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle0', timeout: 30000 });
    const errores = await page.evaluate(() => window.__errores);
    const overflow = await page.evaluate(() => window.__overflow);
    const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
    console.log('Total slides:', total);
    console.log('Errores de presupuesto:', JSON.stringify(errores, null, 2));
    console.log('Desbordamiento:', JSON.stringify(overflow, null, 2));

    // Screenshot representative slides by walking forward with ArrowRight
    // from slide 1 (hash-only navigation doesn't re-run the inline script,
    // so we drive it the same way a human would).
    const targets = [1, 2, 9, 10, 13, 16, 19, 23, 25];
    let cursor = 1;
    for (const target of targets) {
      while (cursor < target) {
        await page.keyboard.press('ArrowRight');
        cursor++;
      }
      await new Promise((r) => setTimeout(r, 1200));
      await page.screenshot({ path: path.resolve(__dirname, `slide-check-${String(target).padStart(2, '0')}.png`) });
    }
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
