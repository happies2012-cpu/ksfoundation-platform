import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Loader2, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate password reset email
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSent(true);
      toast({
        title: 'Reset email sent!',
        description: 'Check your email for password reset instructions.',
      });
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to send reset email.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/logo192.png"
              alt="TaskFlow"
              className="h-16 w-16 object-contain"
            />
          </div>

          <div className="glass-card rounded-2xl p-8">
            {!sent ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-black mb-2">
                    Reset Your <span className="gradient-text-orange">Password</span>
                  </h1>
                  <p className="text-muted-foreground">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="rocket"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                  <p className="text-muted-foreground">
                    We've sent a password reset link to {email}
                  </p>
                </div>
                <Button
                  onClick={() => setSent(false)}
                  variant="outline"
                  className="w-full"
                >
                  Send another email
                </Button>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link to="/login" className="text-primary hover:underline font-medium flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Background with Icons */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-primary/5 to-secondary/5 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-primary/60 rounded-full animate-bounce" />
            <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-secondary/60 rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 left-1/3 w-14 h-14 bg-accent/60 rounded-full animate-bounce" />
            <div className="absolute top-1/2 right-1/3 w-10 h-10 bg-primary/60 rounded-full animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-secondary/60 rounded-full animate-bounce" />
            <div className="absolute top-2/3 left-1/2 w-8 h-8 bg-accent/60 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="absolute bottom-8 left-8 text-white/80">
          <h2 className="text-2xl font-bold mb-2">Secure Recovery</h2>
          <p className="text-sm">Reset your password securely</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
