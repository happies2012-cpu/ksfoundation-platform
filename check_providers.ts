import { createClient } from '@supabase/supabase-js';

const url = 'https://qszwmkspmamcvktkjprf.supabase.co';
const key = 'sb_publishable__Y3rYql5sdwbKlwfgJ7-cQ_FF2ldkQl';
const supabase = createClient(url, key);

async function checkProvider(provider: any) {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: { redirectTo: 'http://localhost' }
        });

        // Supabase client might not throw immediately for OAuth URL generation unless it calls the backend?
        // Actually signInWithOAuth returns a URL. If the backend is checked, we might see it there?
        // Wait, usually it returns a URL. The browser executes it. The ERROR happens when the user clicks it?
        // No, the user provided an error JSON, which usually comes from a direct API response or URL fragment.

        // If the library returns a URL, it thinks it's fine.
        // We can try fetching the URL.

        if (data.url) {
            const res = await fetch(data.url, { redirect: 'manual' });
            if (res.status >= 400) {
                // Likely the error page
                const text = await res.text();
                if (text.includes('Unsupported provider') || text.includes('not enabled')) {
                    return `❌ ${provider}: Disabled (Backend confirmation)`;
                }
            }
            // Use header check
        }

        if (error) return `❌ ${provider}: ${error.message}`;

        return `✅ ${provider}: Configured (URL generated)`;

    } catch (e: any) {
        return `❌ ${provider}: ${e.message}`;
    }
}

async function main() {
    console.log("Checking Supabase Provider Status...");
    console.log(await checkProvider('google'));
    console.log(await checkProvider('facebook'));
    console.log(await checkProvider('linkedin_oidc')); // LinkedIn is often linkedin_oidc now
    console.log(await checkProvider('linkedin'));      // Check legacy too
}

main();
