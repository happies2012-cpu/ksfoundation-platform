import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/lib/api';
import { User, VPSInstance } from '@/lib/supabase';
import { Users, Server, DollarSign, TrendingUp, Download } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [vpsInstances, setVpsInstances] = useState<VPSInstance[]>([]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalVPS: 0,
    activeVPS: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, vpsData, analyticsData] = await Promise.all([
        adminApi.getAllUsers(),
        adminApi.getAllVPSInstances(),
        adminApi.getAnalytics(),
      ]);
      
      setUsers(usersData);
      setVpsInstances(vpsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const userData = [
    { name: 'Users', count: analytics.totalUsers },
    { name: 'Active VPS', count: analytics.activeVPS },
  ];

  const vpsStatusData = [
    { name: 'Active', value: vpsInstances.filter(v => v.status === 'active').length },
    { name: 'Provisioning', value: vpsInstances.filter(v => v.status === 'provisioning').length },
    { name: 'Suspended', value: vpsInstances.filter(v => v.status === 'suspended').length },
    { name: 'Terminated', value: vpsInstances.filter(v => v.status === 'terminated').length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const exportData = () => {
    // In a real implementation, this would export data to CSV
    alert('Data export functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black">
            <span className="gradient-text-orange">Admin Dashboard</span>
          </h1>
          <Button variant="outline" onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-3xl font-black">{analytics.totalUsers}</p>
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
                <p className="text-3xl font-black">{analytics.totalVPS}</p>
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
                <p className="text-3xl font-black">{analytics.activeVPS}</p>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-3xl font-black">${analytics.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10">
                <DollarSign className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">User & VPS Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">VPS Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vpsStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {vpsStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* User Management */}
        <Card className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">User Management</h3>
            <span className="text-sm text-muted-foreground">{users.length} users</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold mr-2">
                          {u.full_name?.charAt(0) || u.email?.charAt(0) || 'U'}
                        </div>
                        <span>{u.full_name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.role === 'admin' 
                          ? 'bg-destructive/10 text-destructive' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* VPS Management */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">VPS Management</h3>
            <span className="text-sm text-muted-foreground">{vpsInstances.length} instances</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Resources</th>
                  <th className="text-left py-3 px-4">Created</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vpsInstances.map((vps) => (
                  <tr key={vps.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{vps.name}</td>
                    <td className="py-3 px-4">
                      {users.find(u => u.id === vps.user_id)?.email || 'Unknown'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vps.status === 'active' 
                          ? 'bg-success/10 text-success' 
                          : vps.status === 'provisioning'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {vps.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {vps.cpu} CPU, {vps.ram}GB RAM
                    </td>
                    <td className="py-3 px-4">
                      {new Date(vps.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
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