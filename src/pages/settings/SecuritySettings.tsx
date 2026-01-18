import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock, Smartphone, Key, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const SecuritySettings = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [loginNotifications, setLoginNotifications] = useState(true);
    const [securityAlerts, setSecurityAlerts] = useState(true);

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({
                title: "Error",
                description: "New passwords do not match.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            toast({
                title: "Password updated",
                description: "Your password has been changed successfully.",
            });
        }, 1000);
    };

    const handleToggle2FA = () => {
        setTwoFactorEnabled(!twoFactorEnabled);
        toast({
            title: twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
            description: twoFactorEnabled
                ? "Two-factor authentication has been disabled."
                : "Two-factor authentication has been enabled.",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
            <div className="container mx-auto p-6 max-w-4xl space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
                    <p className="text-muted-foreground">Manage your account security and authentication</p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            <CardTitle>Change Password</CardTitle>
                        </div>
                        <CardDescription>Update your password regularly to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Smartphone className="h-5 w-5" />
                            <CardTitle>Two-Factor Authentication</CardTitle>
                        </div>
                        <CardDescription>Add an extra layer of security to your account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Enable 2FA</Label>
                                <p className="text-sm text-muted-foreground">
                                    Require a verification code in addition to your password
                                </p>
                            </div>
                            <Switch
                                checked={twoFactorEnabled}
                                onCheckedChange={handleToggle2FA}
                            />
                        </div>
                        {twoFactorEnabled && (
                            <div className="p-4 bg-muted rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <Key className="h-4 w-4" />
                                    <p className="text-sm font-medium">Authenticator App Connected</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Use your authenticator app to generate verification codes
                                </p>
                                <Button variant="outline" size="sm">
                                    Reconfigure
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            <CardTitle>Security Preferences</CardTitle>
                        </div>
                        <CardDescription>Manage your security notifications and alerts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Login Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified when someone logs into your account
                                </p>
                            </div>
                            <Switch
                                checked={loginNotifications}
                                onCheckedChange={setLoginNotifications}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Security Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive alerts about suspicious activity
                                </p>
                            </div>
                            <Switch
                                checked={securityAlerts}
                                onCheckedChange={setSecurityAlerts}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-destructive">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        </div>
                        <CardDescription>Irreversible actions that affect your account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Delete Account</Label>
                                <p className="text-sm text-muted-foreground">
                                    Permanently delete your account and all associated data
                                </p>
                            </div>
                            <Button variant="destructive">
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SecuritySettings;
