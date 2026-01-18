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
  const { signIn, signInWithGoogle, signInWithFacebook, signInWithLinkedIn } = useAuth();
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

  const handleFacebookSignIn = async () => {
    setLoading(true);
    try {
      await signInWithFacebook();
    } catch (error: unknown) {
      toast({
        title: 'Facebook Sign-In failed',
        description: (error as Error).message || 'Failed to sign in with Facebook.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    setLoading(true);
    try {
      await signInWithLinkedIn();
    } catch (error: unknown) {
      toast({
        title: 'LinkedIn Sign-In failed',
        description: (error as Error).message || 'Failed to sign in with LinkedIn.',
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
              className="w-full mb-3"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full mb-3"
              onClick={handleFacebookSignIn}
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </Button>

            <Button
              variant="outline"
              className="w-full mb-6"
              onClick={handleLinkedInSignIn}
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Continue with LinkedIn
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

