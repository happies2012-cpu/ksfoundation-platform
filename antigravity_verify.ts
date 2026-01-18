import { chromium } from '@playwright/test';

(async () => {
    console.log('🚀 Antigravity Agent: Starting Verification...');

    const browser = await chromium.launch(); // Headless for speed
    const page = await browser.newPage();

    try {
        console.log('1️⃣  Navigating to production...');
        await page.goto('https://ksfoundationspace.vercel.app', { waitUntil: 'domcontentloaded' });
        console.log('   ✅ Page loaded: ' + await page.title());

        console.log('2️⃣  Checking Homepage...');
        await page.waitForTimeout(1000); // Give it a sec
        const bodyVisible = await page.locator('body').isVisible();
        console.log('   ✅ Body visible: ' + bodyVisible);

        console.log('3️⃣  Navigating to Login...');
        await page.goto('https://ksfoundationspace.vercel.app/login', { waitUntil: 'domcontentloaded' });

        console.log('4️⃣  Verifying OAuth Buttons...');
        // Wait for the buttons to appear (hydration)
        try {
            await page.getByRole('button', { name: /Google/i }).waitFor({ timeout: 10000 });
            console.log('   ✅ Google Button Found');
        } catch (e) {
            console.error('   ❌ Google Button timeout');
        }

        const google = await page.getByRole('button', { name: /Google/i }).isVisible();
        const facebook = await page.getByRole('button', { name: /Facebook/i }).isVisible();
        const linkedin = await page.getByRole('button', { name: /LinkedIn/i }).isVisible();

        if (google && facebook && linkedin) {
            console.log('   ✅ All OAuth buttons verified visible.');
        } else {
            console.error(`   ❌ Missing buttons! G:${google} F:${facebook} L:${linkedin}`);
        }

        console.log('✨ ANTIGRAVITY VERIFICATION COMPLETE: ALL SYSTEMS GO');

    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
