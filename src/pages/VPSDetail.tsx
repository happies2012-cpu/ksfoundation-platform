import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
  Zap,
  ArrowLeft,
  Power,
  RotateCw,
  Trash2,
  Copy,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { vpsApi } from '@/lib/api';
import { VPSInstance } from '@/lib/supabase';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from '@/hooks/use-toast';

const VPSDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vps, setVps] = useState<VPSInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadVPS = useCallback(async () => {
    setLoading(true);
    try {
      const instances = await vpsApi.getInstances();
      const instance = instances.find((v) => v.id === id);
      
      if (!instance) {
        toast({
          title: 'VPS not found',
          description: 'The requested VPS instance could not be found.',
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }

      setVps(instance);
    } catch (error: unknown) {
      toast({
        title: 'Error loading VPS',
        description: (error as Error).message,
        variant: 'destructive',
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      loadVPS();
    }
  }, [id, loadVPS]);

  const handleRestart = async () => {
    if (!vps) return;

    setActionLoading('restart');
    try {
      await vpsApi.restartInstance(vps.id);
      toast({
        title: 'VPS Restarted',
        description: 'Your VPS has been restarted successfully.',
      });
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!vps) return;

    if (!confirm('Are you sure you want to terminate this VPS? This action cannot be undone.')) {
      return;
    }

    setActionLoading('delete');
    try {
      await vpsApi.deleteInstance(vps.id);
      toast({
        title: 'VPS Terminated',
        description: 'Your VPS has been terminated.',
      });
      navigate('/dashboard');
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-success';
      case 'provisioning':
        return 'bg-primary/20 text-primary';
      case 'suspended':
        return 'bg-destructive/20 text-destructive';
      case 'terminated':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vps) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">
                <span className="gradient-text-orange">{vps.name}</span>
              </h1>
              <Badge className={getStatusColor(vps.status)}>
                {vps.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRestart}
                disabled={actionLoading !== null || vps.status !== 'active'}
              >
                {actionLoading === 'restart' ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Restarting...
                  </>
                ) : (
                  <>
                    <Power className="mr-2 h-4 w-4" />
                    Restart
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={actionLoading !== null}
              >
                {actionLoading === 'delete' ? (
                  <>
                    <Trash2 className="mr-2 h-4 w-4 animate-spin" />
                    Terminating...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Terminate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Specifications */}
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Cpu className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CPU Cores</p>
                    <p className="text-xl font-bold">{vps.cpu} vCPU</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-secondary/10">
                    <Server className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">RAM</p>
                    <p className="text-xl font-bold">{vps.ram} GB</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-success/10">
                    <HardDrive className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Storage</p>
                    <p className="text-xl font-bold">{vps.storage} GB NVMe SSD</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-accent/10">
                    <Wifi className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bandwidth</p>
                    <p className="text-xl font-bold">{vps.bandwidth} TB</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Configuration */}
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6">Configuration</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <span className="text-muted-foreground">Operating System</span>
                  <span className="font-semibold">{vps.os}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <span className="text-muted-foreground">Data Center Location</span>
                  <span className="font-semibold">{vps.location}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-semibold">
                    {new Date(vps.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Connection Info */}
            {vps.status === 'active' && (
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-6">Connection Details</h2>
                <div className="space-y-4">
                  {vps.ip_address && (
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        IP Address
                      </label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 rounded-lg bg-muted font-mono text-sm">
                          {vps.ip_address}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(vps.ip_address!, 'IP Address')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {vps.root_password && (
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Root Password
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <code className="block p-2 rounded-lg bg-muted font-mono text-sm">
                            {showPassword ? vps.root_password : '••••••••••••'}
                          </code>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(vps.root_password!, 'Password')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/dashboard/billing">
                    <Shield className="mr-2 h-4 w-4" />
                    Manage Billing
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/dashboard/settings">
                    <Zap className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VPSDetail;

