import { createClient } from '@supabase/supabase-js';

const url = 'https://supabase.guideitsol.com';
const key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NzI3MjA0MCwiZXhwIjo0OTIyOTQ1NjQwLCJyb2xlIjoiYW5vbiJ9.qA5T_gM2Az_pPFoz-Bx4SemWFYXy7mr89W0-g-bSMtw';

console.log('🔌 Testing Supabase Connection to:', url);

try {
    const supabase = createClient(url, key);

    // Test public access (if any) or just auth health
    supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
            console.error('❌ Auth Check Failed:', error.message);
        } else {
            console.log('✅ Auth Service Reachable');
        }
    });

} catch (e) {
    console.error('❌ Initialization Failed:', e);
}
