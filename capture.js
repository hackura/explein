import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('Authenticating...');
  await page.goto('http://localhost:5173/login');
  await page.evaluate(() => {
    localStorage.setItem('explein_mock_auth', JSON.stringify({id: 'mock-123', email: 'student@example.com'}));
  });
  
  console.log('Capturing Dashboard...');
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000)); // wait for Recharts animations
  await page.screenshot({ path: join(__dirname, 'public/dashboard.png') });
  
  console.log('Capturing Chat...');
  await page.goto('http://localhost:5173/dashboard/chat', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: join(__dirname, 'public/chat.png') });
  
  console.log('Capturing Flashcards...');
  await page.goto('http://localhost:5173/dashboard/flashcards', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: join(__dirname, 'public/flashcards.png') });
  
  await browser.close();
  console.log('Done!');
})();
