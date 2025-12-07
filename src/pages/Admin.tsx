import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Server,
  DollarSign,
  TrendingUp,
  Activity,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/lib/api';
import { User, VPSInstance } from '@/lib/supabase';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from '@/hooks/use-toast';

const Admin = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [vpsInstances, setVpsInstances] = useState<VPSInstance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analyticsData, usersData, vpsData] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getAllUsers(),
        adminApi.getAllVPSInstances(),
      ]);
      setAnalytics(analyticsData);
      setUsers(usersData);
      setVpsInstances(vpsData);
    } catch (error: any) {
      toast({
        title: 'Error loading data',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">
            Admin <span className="gradient-text-orange">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Manage users, VPS instances, and platform analytics
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-3xl font-black">{analytics?.totalUsers || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total VPS</p>
                <p className="text-3xl font-black">{analytics?.totalVPS || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/10">
                <Server className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active VPS</p>
                <p className="text-3xl font-black">{analytics?.activeVPS || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <Activity className="h-6 w-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-3xl font-black">${analytics?.totalRevenue?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/10">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Users</h2>
            <Badge variant="outline">{users.length} total</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-sm font-semibold">Name</th>
                  <th className="text-left p-3 text-sm font-semibold">Email</th>
                  <th className="text-left p-3 text-sm font-semibold">Role</th>
                  <th className="text-left p-3 text-sm font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((u) => (
                  <tr key={u.id} className="border-b border-border/50">
                    <td className="p-3">{u.full_name || 'N/A'}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <Badge variant={u.role === 'admin' ? 'default' : 'outline'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* VPS Instances Table */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">VPS Instances</h2>
            <Badge variant="outline">{vpsInstances.length} total</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-sm font-semibold">Name</th>
                  <th className="text-left p-3 text-sm font-semibold">User</th>
                  <th className="text-left p-3 text-sm font-semibold">Status</th>
                  <th className="text-left p-3 text-sm font-semibold">Specs</th>
                  <th className="text-left p-3 text-sm font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {vpsInstances.slice(0, 10).map((vps) => (
                  <tr key={vps.id} className="border-b border-border/50">
                    <td className="p-3 font-medium">{vps.name}</td>
                    <td className="p-3 text-sm text-muted-foreground">{vps.user_id.slice(0, 8)}...</td>
                    <td className="p-3">
                      <Badge
                        className={
                          vps.status === 'active'
                            ? 'bg-success/20 text-success'
                            : vps.status === 'provisioning'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {vps.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {vps.cpu}vCPU / {vps.ram}GB / {vps.storage}GB
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {new Date(vps.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;

