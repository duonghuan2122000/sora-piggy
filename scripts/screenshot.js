/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const outDir = './openspec/changes/pbi-16-chuyen-giao-dien-ant-design/screenshots';
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const base = 'http://localhost:5173';
  const routes = ['/', '/transactions'];
  for (const r of routes) {
    const url = base + r;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      const safeName = r === '/' ? 'home' : r.replace(/\//g, '_').replace(/^_/, '');
      const path = `${outDir}/${safeName}.png`;
      await page.screenshot({ path, fullPage: true });
      console.log('Saved', path);
    } catch (e) {
      console.error('Failed to screenshot', url, e.message);
    }
  }
  await browser.close();
})();
