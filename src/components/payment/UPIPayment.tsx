import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Copy, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface UPIPaymentProps {
    amount: number;
    description?: string;
    onPaymentComplete?: () => void;
}

export const UPIPayment: React.FC<UPIPaymentProps> = ({
    amount,
    description = "KSF Foundation Services", // Updated default description
    onPaymentComplete
}) => {
    // UPI Configuration
    const upiId = "8884162999-4@ybl";
    const merchantName = "KSFoundation";

    // Generate UPI URL
    // Format: upi://pay?pa=<vpa>&pn=<name>&am=<amount>&cu=<currency>&tn=<note>
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}`;

    const handleCopyUPI = () => {
        navigator.clipboard.writeText(upiId);
        toast.success("UPI ID copied to clipboard");
    };

    const handleVerify = () => {
        // In a real app, this would check a webhook or poll an API
        toast.info("Verifying payment status...");
        setTimeout(() => {
            toast.success("Payment Verified! (Simulation)");
            if (onPaymentComplete) onPaymentComplete();
        }, 2000);
    };

    return (
        <Card className="w-full max-w-md mx-auto border-indigo-500/20 bg-black/40 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-indigo-400" />
                    UPI Payment
                </CardTitle>
                <CardDescription>
                    Scan QR code or use UPI ID to pay <span className="text-indigo-400 font-bold">₹{amount}</span>
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* QR Code Section */}
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg shadow-indigo-500/10">
                    <QRCodeSVG
                        value={upiUrl}
                        size={200}
                        level="H"
                        includeMargin={true}
                        imageSettings={{
                            src: "/favicon.ico", // Ensure this exists or remove
                            x: undefined,
                            y: undefined,
                            height: 24,
                            width: 24,
                            excavate: true,
                        }}
                    />
                    <p className="mt-4 text-xs text-gray-500 font-mono text-center">
                        Scan with GPay, PhonePe, Paytm, or any UPI app
                    </p>
                </div>

                {/* Manual Payment Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-white/10">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">UPI ID</span>
                            <span className="font-mono text-sm font-bold text-indigo-300">{upiId}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleCopyUPI} className="hover:bg-indigo-500/20 hover:text-indigo-300">
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <span className="text-lg font-bold">₹{amount.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
                <Button
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 font-semibold shadow-lg shadow-indigo-500/20"
                    size="lg"
                    onClick={handleVerify}
                >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    I have made the payment
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                    Transaction ID verification will happen automatically.
                </p>
            </CardFooter>
        </Card>
    );
};
