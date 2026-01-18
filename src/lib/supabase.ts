import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://supabase.guideitsol.com';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are valid (not placeholder)
const isValidConfig = supabaseUrl && supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder');

if (!isValidConfig) {
  console.warn('⚠️ Supabase credentials missing or invalid. Auth will fail.');
}

// Create client if config is valid, otherwise use a safe mock that throws specific errors
export const supabase = isValidConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signInWithPassword: () => Promise.reject(new Error("Supabase Anon Key missing. Check .env")),
      signUp: () => Promise.reject(new Error("Supabase Anon Key missing. Check .env")),
      signInWithOAuth: () => Promise.reject(new Error("Supabase Anon Key missing. Check .env")),
      signInWithOtp: () => Promise.reject(new Error("Supabase Anon Key missing. Check .env")),
      verifyOtp: () => Promise.reject(new Error("Supabase Anon Key missing. Check .env")),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.reject(new Error("Supabase Anon Key missing. Check .env")),
    },
    from: () => ({
      select: () => ({
        data: [],
        error: null,
        eq: () => ({ data: null, error: null, single: () => ({ data: null, error: null }) }),
        order: () => ({ data: [], error: null }),
        limit: () => ({ data: [], error: null }),
        maybeSingle: () => ({ data: null, error: null })
      }),
      insert: () => ({ data: null, error: null, select: () => ({ data: null, error: null, single: () => ({ data: null, error: null }) }) }),
      update: () => ({ data: null, error: null, select: () => ({ data: null, error: null, single: () => ({ data: null, error: null }) }) }),
      delete: () => ({ data: null, error: null }),
      upsert: () => ({ data: null, error: null })
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    },
    channel: () => ({
      on: () => ({ subscribe: () => { } }),
      subscribe: () => { }
    })
  } as any;

// Database Types
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface VPSInstance {
  id: string;
  user_id: string;
  name: string;
  plan_id: string | null;
  status: 'pending' | 'provisioning' | 'active' | 'suspended' | 'terminated';
  cpu: number;
  ram: number;
  storage: number;
  bandwidth: number;
  os: string;
  location: string;
  ip_address: string | null;
  root_password: string | null;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  invited_by: string | null;
  invited_at: string;
  joined_at: string | null;
  created_at: string;
}

export interface WorkspaceInvite {
  id: string;
  workspace_id: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  invited_by: string;
  accepted: boolean;
  created_at: string;
  expires_at: string;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  workspace_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id: string | null;
  creator_id: string;
  due_date: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  uploaded_by: string;
  created_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Label {
  id: string;
  workspace_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  vps_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'past_due' | 'expired';
  plan: 'free' | 'pro' | 'team';
  billing_cycle: 'monthly' | 'annual';
  amount: number;
  currency: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  subscription_id: string | null;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  due_date: string;
  paid_at: string | null;
  stripe_invoice_id: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  action_url: string | null;
  created_at: string;
}

export interface ActivityFeed {
  id: string;
  workspace_id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}