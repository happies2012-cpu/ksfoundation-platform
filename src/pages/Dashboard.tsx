import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Server,
  Plus,
  Activity,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Zap,
  HardDrive,
  Wifi,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { vpsApi, subscriptionApi, invoiceApi } from '@/lib/api';
import { VPSInstance, Subscription, Invoice } from '@/lib/supabase';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [vpsInstances, setVpsInstances] = useState<VPSInstance[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [vps, subs, invs] = await Promise.all([
        vpsApi.getInstances(),
        subscriptionApi.getSubscriptions(),
        invoiceApi.getInvoices(),
      ]);
      setVpsInstances(vps);
      setSubscriptions(subs);
      setInvoices(invs);
    } catch (error: unknown) {
      toast({
        title: 'Error loading data',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const activeVPS = vpsInstances.filter((v) => v.status === 'active').length;
  const totalRevenue = subscriptions.reduce((sum, s) => sum + (s.amount || 0), 0);
  const pendingInvoices = invoices.filter((i) => i.status === 'open').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-success';
      case 'provisioning':
        return 'bg-primary/20 text-primary';
      case 'suspended':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">
            Welcome back, <span className="gradient-text-orange">{user?.full_name || 'User'}</span>
          </h1>
          <p className="text-muted-foreground">
            Manage your VPS instances and subscriptions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active VPS</p>
                <p className="text-3xl font-black">{activeVPS}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Server className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total VPS</p>
                <p className="text-3xl font-black">{vpsInstances.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/10">
                <Activity className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-3xl font-black">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Invoices</p>
                <p className="text-3xl font-black">{pendingInvoices}</p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Quick Actions</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="rocket" asChild>
              <Link to="/vps">
                <Plus className="mr-2 h-4 w-4" />
                Deploy New VPS
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/billing">
                <DollarSign className="mr-2 h-4 w-4" />
                View Billing
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/settings">
                <TrendingUp className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* VPS Instances */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your VPS Instances</h2>
            <Button variant="outline" asChild>
              <Link to="/dashboard/vps">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {vpsInstances.length === 0 ? (
            <Card className="glass-card p-12 text-center">
              <Server className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No VPS instances yet</h3>
              <p className="text-muted-foreground mb-6">
                Deploy your first VPS instance to get started
              </p>
              <Button variant="rocket" asChild>
                <Link to="/vps">
                  <Plus className="mr-2 h-4 w-4" />
                  Deploy VPS
                </Link>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vpsInstances.slice(0, 6).map((instance) => (
                <Card key={instance.id} className="glass-card p-6 hover:scale-105 transition-transform">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{instance.name}</h3>
                      <Badge className={getStatusColor(instance.status)}>
                        {instance.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>{instance.cpu} vCPU</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Server className="h-4 w-4 text-secondary" />
                      <span>{instance.ram} GB RAM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <HardDrive className="h-4 w-4 text-success" />
                      <span>{instance.storage} GB</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Wifi className="h-4 w-4 text-accent" />
                      <span>{instance.bandwidth} TB</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/dashboard/vps/${instance.id}`}>
                      Manage <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;