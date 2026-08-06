#!/usr/bin/env node

const path = require('path');
const { pathToFileURL } = require('url');

const html = path.resolve(__dirname, 'hoja-tu-perfil-hepatico.html');
const pdf = path.resolve(__dirname, 'hoja-tu-perfil-hepatico.pdf');

(async () => {
  const puppeteerPath = path.resolve(__dirname, '../../semana-06-2026-06-29-dolor-rb/slides/node_modules/puppeteer/lib/puppeteer/puppeteer.js');
  const { default: puppeteer } = await import(pathToFileURL(puppeteerPath).href);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--allow-file-access-from-files', '--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: pdf,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    console.log(`Creado: ${pdf}`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
