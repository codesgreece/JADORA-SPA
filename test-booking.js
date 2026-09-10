const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  
  console.log('1. Navigating to localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  console.log('2. Taking initial screenshot...');
  await page.screenshot({ path: '/tmp/step1-initial.png', fullPage: true });
  
  console.log('3. Scrolling to booking widget...');
  await page.evaluate(() => {
    const widget = document.querySelector('h2, h3, [class*="booking"], [class*="calendar"]');
    if (widget) widget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo(0, 1500);
  });
  
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/step2-booking-widget.png', fullPage: false });
  
  console.log('4. Looking for available Saturday date...');
  const saturdaySelector = await page.evaluate(() => {
    const dates = Array.from(document.querySelectorAll('[class*="date"], [class*="day"], button'));
    const saturday = dates.find(d => {
      const text = d.textContent || d.innerText;
      return text && /1[0-9]|2[0-9]/.test(text) && d.querySelector('[class*="available"], [class*="pink"]');
    });
    return saturday ? saturday.outerHTML : null;
  });
  
  console.log('Saturday found:', !!saturdaySelector);
  
  console.log('Closing browser...');
  await browser.close();
  
  console.log('Done! Screenshots saved to /tmp/');
})();
