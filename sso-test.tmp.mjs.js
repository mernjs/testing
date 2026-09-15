const { chromium } = require('playwright-core');

const EXEC_PATH = '/Users/vijaypratapsingh/Library/Caches/ms-playwright/chromium-1124/chrome-mac/Chromium.app/Contents/MacOS/Chromium';
const BASE = 'http://localhost:3000';

const panels = [
  { name: 'HRMS', url: `${BASE}/hrms`, loginPath: '/hrms/login' },
  { name: 'PMS', url: `${BASE}/pms`, loginPath: '/pms/login' },
  { name: 'PRMS', url: `${BASE}/prms`, loginPath: '/prms/login' },
  { name: 'TMS', url: `${BASE}/tms`, loginPath: '/tms/login' },
  { name: 'Messenger', url: `${BASE}/messenger`, loginPath: '/messenger/login' },
  { name: 'LMS', url: `${BASE}/lms`, loginPath: '/lms/login' },
];

(async () => {
  const browser = await chromium.launch({ executablePath: EXEC_PATH, headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  const badResponses = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('response', (res) => {
    if (res.status() >= 500) badResponses.push(`${res.status()} ${res.url()}`);
  });

  const results = {};

  // Step 1: login
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle', timeout: 40000 });
  await page.fill('input[type="email"], input[name="email"]', 'command-center-test@yashorbit.local');
  await page.fill('input[type="password"], input[name="password"]', 'TestPassword123456');
  await Promise.all([
    page.waitForLoadState('networkidle', { timeout: 40000 }),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForTimeout(1000);
  results.postLoginUrl = page.url();

  // handle forced password change
  if (results.postLoginUrl.includes('/admin/change-password')) {
    results.forcedPasswordChange = true;
    // capture cookies at this point before deciding further action
    results.cookiesAtChangePassword = await context.cookies();
  } else {
    results.forcedPasswordChange = false;
  }

  // cookies right after login step
  const cookiesAfterLogin = await context.cookies();
  results.cookiesAfterLogin = cookiesAfterLogin.map(c => ({ name: c.name, value: c.value, domain: c.domain, path: c.path }));

  // Step 2 & 3: visit each panel
  for (const panel of panels) {
    const resp = await page.goto(panel.url, { waitUntil: 'networkidle', timeout: 40000 }).catch(e => null);
    await page.waitForTimeout(500);
    const finalUrl = page.url();
    const status = resp ? resp.status() : null;
    const bodyText = await page.textContent('body').catch(() => '');
    const landedOnLogin = finalUrl.includes(panel.loginPath) || finalUrl.includes('/login');
    results[panel.name] = {
      finalUrl,
      status,
      landedOnLogin,
      bodyPreview: bodyText ? bodyText.slice(0, 300).replace(/\s+/g, ' ') : '',
    };
  }

  results.consoleErrors = consoleErrors;
  results.badResponses = badResponses;

  const finalCookies = await context.cookies();
  results.finalCookies = finalCookies.map(c => ({ name: c.name, value: c.value }));

  console.log(JSON.stringify(results, null, 2));

  await browser.close();
})().catch((err) => {
  console.error('SCRIPT ERROR', err);
  process.exit(1);
});
