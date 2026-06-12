// Usage: node scripts/mobile-check.js <path> [selectorThatMustExist]
// Loads http://localhost:3000<path> at iPhone width and fails if the page
// scrolls horizontally or the required selector is missing. Sets guestMode so
// auth-gated pages render with demo data.
const puppeteer = require("puppeteer-core");

const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const path = process.argv[2] || "/";
const mustExist = process.argv[3] || null;
const BASE = process.env.BASE_URL || "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 45000 });
  await page.evaluate(() => localStorage.setItem("guestMode", "1"));
  await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 45000 });
  await sleep(2500);
  const r = await page.evaluate((sel) => ({
    overflowsX: document.documentElement.scrollWidth > window.innerWidth + 2,
    docWidth: document.documentElement.scrollWidth,
    inner: window.innerWidth,
    sel: sel ? !!document.querySelector(sel) : true,
  }), mustExist);
  await browser.close();
  const ok = !r.overflowsX && r.sel;
  console.log(JSON.stringify({ path, ...r, PASS: ok }));
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error("ERR:", e.message); process.exit(2); });
