import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, ArrowRight, Server, Cloud, Database, Globe, Shield, Zap, Chrome } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
      });
      navigate('/dashboard');
    } catch (error: unknown) {
      toast({
        title: 'Login failed',
        description: (error as Error).message || 'Invalid email or password.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      toast({
        title: 'Google Sign-In failed',
        description: (error as Error).message || 'Failed to sign in with Google.',
        variant: 'destructive',
      });
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
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black mb-2">
                Welcome <span className="gradient-text-orange">Back</span>
              </h1>
              <p className="text-muted-foreground">
                Sign in to manage your tasks and collaborate with your team
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full mb-6"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
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

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Background with Icons */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-primary/5 to-secondary/5 animate-pulse" />

        {/* Floating Icons */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <Server className="absolute top-1/4 left-1/4 h-12 w-12 text-primary/60 animate-bounce" style={{ animationDelay: '0s' }} />
            <Cloud className="absolute top-1/3 right-1/4 h-16 w-16 text-secondary/60 animate-pulse" style={{ animationDelay: '1s' }} />
            <Database className="absolute bottom-1/4 left-1/3 h-14 w-14 text-accent/60 animate-bounce" style={{ animationDelay: '2s' }} />
            <Globe className="absolute top-1/2 right-1/3 h-10 w-10 text-primary/60 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <Shield className="absolute bottom-1/3 right-1/4 h-12 w-12 text-secondary/60 animate-bounce" style={{ animationDelay: '1.5s' }} />
            <Zap className="absolute top-2/3 left-1/2 h-8 w-8 text-accent/60 animate-pulse" style={{ animationDelay: '2.5s' }} />
          </div>
        </div>

        {/* Overlay Text */}
        <div className="absolute bottom-8 left-8 text-white/80">
          <h2 className="text-2xl font-bold mb-2">Secure & Reliable</h2>
          <p className="text-sm">Your data is safe with enterprise-grade security</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

