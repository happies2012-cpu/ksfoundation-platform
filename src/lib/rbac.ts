import { useAuthStore, type User } from '../store';

export type Role = 'admin' | 'developer' | 'editor' | 'viewer';

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  roles: Role[];
}

export const PERMISSIONS: Permission[] = [
  // User Management
  { resource: 'users', action: 'create', roles: ['admin'] },
  { resource: 'users', action: 'read', roles: ['admin', 'developer', 'editor'] },
  { resource: 'users', action: 'update', roles: ['admin'] },
  { resource: 'users', action: 'delete', roles: ['admin'] },
  { resource: 'users', action: 'manage', roles: ['admin'] },

  // Admin Dashboard
  { resource: 'admin', action: 'read', roles: ['admin'] },
  { resource: 'admin', action: 'manage', roles: ['admin'] },

  // Projects
  { resource: 'projects', action: 'create', roles: ['admin', 'developer', 'editor'] },
  { resource: 'projects', action: 'read', roles: ['admin', 'developer', 'editor', 'viewer'] },
  { resource: 'projects', action: 'update', roles: ['admin', 'developer', 'editor'] },
  { resource: 'projects', action: 'delete', roles: ['admin', 'developer'] },

  // AI Lab
  { resource: 'ai-lab', action: 'create', roles: ['admin', 'developer', 'editor'] },
  { resource: 'ai-lab', action: 'read', roles: ['admin', 'developer', 'editor', 'viewer'] },
  { resource: 'ai-lab', action: 'update', roles: ['admin', 'developer'] },
  { resource: 'ai-lab', action: 'delete', roles: ['admin'] },

  // Settings
  { resource: 'settings', action: 'read', roles: ['admin', 'developer', 'editor', 'viewer'] },
  { resource: 'settings', action: 'update', roles: ['admin', 'developer'] },

  // Billing
  { resource: 'billing', action: 'read', roles: ['admin', 'developer', 'editor'] },
  { resource: 'billing', action: 'manage', roles: ['admin'] },

  // Analytics
  { resource: 'analytics', action: 'read', roles: ['admin', 'developer'] },
  { resource: 'analytics', action: 'manage', roles: ['admin'] },

  // Audit
  { resource: 'audit', action: 'read', roles: ['admin'] },
  { resource: 'audit', action: 'manage', roles: ['admin'] },
];

export const hasPermission = (
  user: User | null,
  resource: string,
  action: Permission['action']
): boolean => {
  if (!user) return false;

  const permission = PERMISSIONS.find(
    p => p.resource === resource && p.action === action
  );

  if (!permission) return false;

  return permission.roles.includes(user.role);
};

export const canAccessRoute = (user: User | null, route: string): boolean => {
  if (!user) return route === '/login' || route === '/signup';

  // Admin routes
  if (route.startsWith('/admin')) {
    return hasPermission(user, 'admin', 'read');
  }

  // Protected routes
  if (route.startsWith('/dashboard') || route.startsWith('/projects')) {
    return hasPermission(user, 'projects', 'read');
  }

  if (route.startsWith('/ai-lab')) {
    return hasPermission(user, 'ai-lab', 'read');
  }

  if (route.startsWith('/settings')) {
    return hasPermission(user, 'settings', 'read');
  }

  // Public routes
  return true;
};

export const getAccessibleRoutes = (user: User | null): string[] => {
  if (!user) return ['/', '/login', '/signup', '/forgot-password'];

  const routes: string[] = ['/'];

  // All authenticated users
  routes.push('/dashboard', '/ai-lab', '/settings');

  // Admin routes
  if (hasPermission(user, 'admin', 'read')) {
    routes.push('/admin', '/admin/users', '/admin/audit');
  }

  // Developer routes
  if (user.role === 'admin' || user.role === 'developer') {
    routes.push('/projects', '/analytics');
  }

  // Editor routes
  if (['admin', 'developer', 'editor'].includes(user.role)) {
    routes.push('/projects/create');
  }

  return routes;
};

export const isRoleOrHigher = (userRole: Role, requiredRole: Role): boolean => {
  const roleHierarchy: Record<Role, number> = {
    viewer: 1,
    editor: 2,
    developer: 3,
    admin: 4,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

