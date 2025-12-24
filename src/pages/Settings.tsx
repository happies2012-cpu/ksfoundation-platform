import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { User, Mail, Lock, Bell, Shield, CreditCard, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleSaveProfile = () => {
    toast({
      title: 'Profile updated',
      description: 'Your profile has been updated successfully.',
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: 'Security settings updated',
      description: 'Your security settings have been saved.',
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: 'Notification preferences updated',
      description: 'Your notification preferences have been saved.',
    });
  };

  const handleSaveAppearance = () => {
    toast({
      title: 'Appearance settings updated',
      description: 'Your appearance settings have been saved.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black mb-8">
            <span className="gradient-text-orange">Settings</span>
          </h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Monitor className="mr-2 h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="billing">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                        aria-label="Full name input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        aria-label="Email input"
                      />
                    </div>
                  </div>

                  <Button variant="rocket" onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                      aria-label="Toggle two-factor authentication"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      <Input
                        id="currentPassword"
                        type="password"
                        className="pl-10"
                        placeholder="Enter current password"
                        aria-label="Current password input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      <Input
                        id="newPassword"
                        type="password"
                        className="pl-10"
                        placeholder="Enter new password"
                        aria-label="New password input"
                      />
                    </div>
                  </div>

                  <Button variant="rocket" onClick={handleSaveSecurity}>
                    Update Password
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      aria-label="Toggle email notifications"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Push Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                      aria-label="Toggle push notifications"
                    />
                  </div>

                  <Button variant="rocket" onClick={handleSaveNotifications}>
                    Save Preferences
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-6">Appearance</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-[180px]" aria-label="Select theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="rocket" onClick={handleSaveAppearance}>
                    Save Preferences
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-6">Billing Information</h2>
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-2">Payment Method</p>
                    <p className="font-semibold">No payment method on file</p>
                  </div>

                  <Button variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;