import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Menu, X, User, LogOut, Home, Server, Cloud, Globe, Mail, Settings, CreditCard, Users } from 'lucide-react';
import { RealtimeNotifications } from '@/components/notifications/RealtimeNotifications';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo192.png" alt="KSR Foundation" className="h-8 w-8" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/dashboard" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link 
            to="/dashboard/workspaces" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Workspaces
          </Link>
          <Link 
            to="/vps" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            VPS
          </Link>
          <Link 
            to="/wordpress-hosting" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            WordPress
          </Link>
          <Link 
            to="/cloud-hosting" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Cloud
          </Link>
          <Link 
            to="/domains" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Domains
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <ThemeToggle />
              <RealtimeNotifications onNotificationCountChange={setNotificationCount} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || ''} alt={user.full_name || user.email} />
                      <AvatarFallback>
                        {user.full_name?.charAt(0) || user.email.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <p className="text-sm font-medium leading-none">{user.full_name || user.email}</p>
                  </div>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/billing" className="cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/workspaces" className="cursor-pointer">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Workspaces</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="rocket" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col space-y-4 pt-8">
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/dashboard/workspaces" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Workspaces
                </Link>
                <Link 
                  to="/vps" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  VPS
                </Link>
                <Link 
                  to="/wordpress-hosting" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  WordPress
                </Link>
                <Link 
                  to="/cloud-hosting" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Cloud
                </Link>
                <Link 
                  to="/domains" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Domains
                </Link>
                {user && (
                  <>
                    <Link 
                      to="/dashboard/profile" 
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/dashboard/settings" 
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Settings
                    </Link>
                    <Link 
                      to="/dashboard/billing" 
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Billing
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-left text-sm font-medium transition-colors hover:text-primary"
                    >
                      Log out
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;