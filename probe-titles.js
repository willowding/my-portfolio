const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const targets = [
    { url: 'http://localhost:3000/projects/',                  sel: '.section-title', label: '代表项目' },
    { url: 'http://localhost:3000/projects/picreview/',        sel: '.pr-hero-title', label: 'PR hero' },
    { url: 'http://localhost:3000/projects/youtube-operation/', sel: '.yt-hero-title', label: 'YT hero' },
  ];
  for (const t of targets) {
    await page.goto(t.url, { waitUntil: 'networkidle' });
    const info = await page.locator(t.sel).first().evaluate(el => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        left: Math.round(r.left * 100) / 100,
        top: Math.round(r.top * 100) / 100,
        width: Math.round(r.width * 100) / 100,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        padding: cs.paddingLeft,
        marginLeft: cs.marginLeft,
      };
    });
    console.log(JSON.stringify({ url: t.url, sel: t.sel, label: t.label, ...info }));
  }
  await browser.close();
})();