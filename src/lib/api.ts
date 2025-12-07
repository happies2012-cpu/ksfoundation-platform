import { supabase, User, VPSInstance, Subscription, Invoice, Notification } from './supabase';

// Auth API
export const authApi = {
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data as User;
  },
};

// VPS API
export const vpsApi = {
  async getInstances(): Promise<VPSInstance[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('vps_instances')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createInstance(config: {
    name: string;
    plan_id?: string;
    cpu: number;
    ram: number;
    storage: number;
    bandwidth: number;
    os: string;
    location: string;
  }): Promise<VPSInstance> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Auto-approval: Create instance immediately
    const { data, error } = await supabase
      .from('vps_instances')
      .insert({
        user_id: user.id,
        ...config,
        status: 'provisioning',
        ip_address: null,
      })
      .select()
      .single();

    if (error) throw error;

    // Auto-workflow: Trigger provisioning
    setTimeout(() => {
      this.provisionInstance(data.id);
    }, 1000);

    return data;
  },

  async provisionInstance(instanceId: string) {
    // Simulate provisioning workflow
    const { data, error } = await supabase
      .from('vps_instances')
      .update({
        status: 'active',
        ip_address: this.generateIP(),
        root_password: this.generatePassword(),
      })
      .eq('id', instanceId)
      .select()
      .single();

    if (error) throw error;

    // Auto-notification
    await notificationApi.create({
      user_id: data.user_id,
      type: 'success',
      title: 'VPS Provisioned',
      message: `Your VPS "${data.name}" is now active!`,
      action_url: `/dashboard/vps/${data.id}`,
    });

    return data;
  },

  async deleteInstance(instanceId: string) {
    const { data, error } = await supabase
      .from('vps_instances')
      .update({ status: 'terminated' })
      .eq('id', instanceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async restartInstance(instanceId: string) {
    // Simulate restart
    return { success: true, message: 'VPS restarted successfully' };
  },

  generateIP(): string {
    return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  },

  generatePassword(): string {
    return Math.random().toString(36).slice(-12);
  },
};

// Subscription API
export const subscriptionApi = {
  async getSubscriptions(): Promise<Subscription[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createSubscription(vpsId: string, planId: string, billingCycle: 'monthly' | 'annual') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Auto-approval: Create subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        vps_id: vpsId,
        plan_id: planId,
        billing_cycle: billingCycle,
        status: 'active',
        amount: this.calculateAmount(planId, billingCycle),
        currency: 'USD',
        current_period_start: new Date().toISOString(),
        current_period_end: this.calculateEndDate(billingCycle),
        cancel_at_period_end: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async cancelSubscription(subscriptionId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  calculateAmount(planId: string, cycle: 'monthly' | 'annual'): number {
    // Simplified calculation
    return cycle === 'annual' ? 100 : 10;
  },

  calculateEndDate(cycle: 'monthly' | 'annual'): string {
    const date = new Date();
    if (cycle === 'annual') {
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    return date.toISOString();
  },
};

// Invoice API
export const invoiceApi = {
  async getInvoices(): Promise<Invoice[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};

// Notification API
export const notificationApi = {
  async getNotifications(): Promise<Notification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  },

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  async create(notification: Omit<Notification, 'id' | 'created_at' | 'read'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notification,
        read: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Admin API
export const adminApi = {
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAllVPSInstances(): Promise<VPSInstance[]> {
    const { data, error } = await supabase
      .from('vps_instances')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAnalytics() {
    // Aggregate analytics
    const { data: users } = await supabase.from('users').select('id');
    const { data: vps } = await supabase.from('vps_instances').select('id, status');
    const { data: subscriptions } = await supabase.from('subscriptions').select('id, status, amount');

    return {
      totalUsers: users?.length || 0,
      totalVPS: vps?.length || 0,
      activeVPS: vps?.filter(v => v.status === 'active').length || 0,
      totalRevenue: subscriptions?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0,
    };
  },
};

