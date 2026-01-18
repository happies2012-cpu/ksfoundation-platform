
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UPIPayment } from '@/components/payment/UPIPayment';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, Database, LayoutDashboard } from 'lucide-react';

export default function DebugPage() {
    const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
    const [authProviders, setAuthProviders] = useState<string[]>([]);
    const [dbError, setDbError] = useState<string>('');

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        try {
            // 1. Check DB Connection by fetching user count (or just checking if we can select)
            const { count, error } = await supabase.from('users').select('*', { count: 'exact', head: true });

            if (error && error.code !== 'PGRST116') { // PGRST116 is just no rows, which is fine for connection check
                // If table doesn't exist, it might be 404. Let's try to just get session.
                console.error("DB Error:", error);
                // If we can't query tables, maybe they don't exist.
                // Let's assume error means disconnected for now unless it's specific.
                setDbStatus('error');
                setDbError(error.message);
            } else {
                setDbStatus('connected');
            }

            // 2. Check Auth Methods
            // Supabase client doesn't expose a "listProviders" API directly to client, 
            // but we can imply it from the configuration we know we set up.
            // We will list what WE have configured.
            setAuthProviders(['email', 'phone', 'google', 'facebook', 'linkedin']);

        } catch (e: any) {
            setDbStatus('error');
            setDbError(e.message);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 space-y-8 pt-24">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                        System Diagnostics
                    </h1>
                    <Button variant="outline" onClick={() => window.location.href = '/'}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Database Status */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-blue-400" />
                                Database Connection
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className={`h-3 w-3 rounded-full ${dbStatus === 'connected' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 animate-pulse'}`} />
                                <span className="font-mono text-lg">
                                    {dbStatus === 'checking' ? 'Testing Connection...' :
                                        dbStatus === 'connected' ? 'Connected to Supabase' : 'Connection Failed'}
                                </span>
                            </div>
                            {dbError && (
                                <Alert variant="destructive" className="mt-4 bg-red-900/20 border-red-900">
                                    <AlertTitle>Error Details</AlertTitle>
                                    <AlertDescription className="font-mono text-xs">
                                        {dbError}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="mt-4 text-xs text-zinc-500 font-mono">
                                URL: {import.meta.env.VITE_SUPABASE_URL}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Auth Providers */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-purple-400" />
                                Auth Providers (Configured)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {authProviders.map(p => (
                                    <Badge key={p} variant="secondary" className="uppercase tracking-wider">
                                        {p}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* UPI Payment Test */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b border-zinc-800 pb-2">Payment Gateway Verification</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="prose prose-invert">
                            <p className="text-zinc-400">
                                This section verifies the UPI QR Code generation with the VPA
                                <span className="text-indigo-400 font-mono ml-1">8884162999-4@ybl</span>.
                            </p>
                            <ul className="text-sm space-y-2 text-zinc-500">
                                <li>• Generates standard UPI intent link</li>
                                <li>• Renders scannable QR Code</li>
                                <li>• Simulates webhook verification</li>
                            </ul>
                        </div>
                        <UPIPayment amount={1} description="Test Transaction" />
                    </div>
                </div>
            </div>
        </div>
    );
}
