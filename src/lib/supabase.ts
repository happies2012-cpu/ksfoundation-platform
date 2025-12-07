import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database Types
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
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

export interface Subscription {
  id: string;
  user_id: string;
  vps_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'past_due' | 'expired';
  billing_cycle: 'monthly' | 'annual';
  amount: number;
  currency: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  subscription_id: string;
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

