import { supabase, User, VPSInstance, Subscription, Invoice, Notification, Workspace, WorkspaceMember, WorkspaceInvite, Project, Task } from './supabase';
import { emailService } from './email';

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

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
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

// User API
export const userApi = {
  async updateUserProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async uploadAvatar(file: File, userId: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
      
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  }
};

// Workspaces API
export const workspacesApi = {
  async getWorkspaces(): Promise<Workspace[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('workspaces')
      .select(`
        *,
        workspace_members(role)
      `)
      .eq('workspace_members.user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createWorkspace(name: string, description?: string): Promise<Workspace> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        name,
        description,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Add owner as member
    await supabase
      .from('workspace_members')
      .insert({
        workspace_id: data.id,
        user_id: user.id,
        role: 'owner',
      });

    return data;
  },

  async updateWorkspace(workspaceId: string, updates: Partial<Workspace>): Promise<Workspace> {
    const { data, error } = await supabase
      .from('workspaces')
      .update(updates)
      .eq('id', workspaceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteWorkspace(workspaceId: string): Promise<void> {
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', workspaceId);

    if (error) throw error;
  },

  async getWorkspaceMembers(workspaceId: string): Promise<(WorkspaceMember & { user: User })[]> {
    const { data, error } = await supabase
      .from('workspace_members')
      .select(`
        *,
        user:users(id, email, full_name, avatar_url)
      `)
      .eq('workspace_id', workspaceId);

    if (error) throw error;
    return data || [];
  },

  async inviteMember(workspaceId: string, email: string, role: 'admin' | 'member' = 'member'): Promise<WorkspaceInvite> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('workspace_invites')
      .insert({
        workspace_id: workspaceId,
        email,
        role,
        invited_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getInvites(): Promise<WorkspaceInvite[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('workspace_invites')
      .select(`
        *,
        workspace:workspaces(name)
      `)
      .eq('email', user.email)
      .eq('accepted', false);

    if (error) throw error;
    return data || [];
  },

  async acceptInvite(inviteId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get the invite
    const { data: invite, error: inviteError } = await supabase
      .from('workspace_invites')
      .select('*')
      .eq('id', inviteId)
      .single();

    if (inviteError) throw inviteError;

    // Add user as member
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: invite.workspace_id,
        user_id: user.id,
        role: invite.role,
        invited_by: invite.invited_by,
        joined_at: new Date().toISOString(),
      });

    if (memberError) throw memberError;

    // Mark invite as accepted
    const { error: updateError } = await supabase
      .from('workspace_invites')
      .update({ accepted: true })
      .eq('id', inviteId);

    if (updateError) throw updateError;
  },

  async removeMember(memberId: string): Promise<void> {
    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;
  }
};

// Projects API
export const projectsApi = {
  async getProjects(workspaceId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createProject(workspaceId: string, name: string, description?: string, color?: string): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        workspace_id: workspaceId,
        name,
        description,
        color,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  }
};

// Tasks API
export const tasksApi = {
  async getTasks(workspaceId: string, projectId?: string): Promise<Task[]> {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        assignee:users(id, full_name, avatar_url),
        project:projects(name, color)
      `)
      .eq('workspace_id', workspaceId)
      .order('position', { ascending: true });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async createTask(workspaceId: string, projectId: string | null, title: string, description?: string, assigneeId?: string): Promise<Task> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get the next position
    const { data: lastTask } = await supabase
      .from('tasks')
      .select('position')
      .eq('workspace_id', workspaceId)
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextPosition = lastTask ? lastTask.position + 1 : 0;

    const taskData = {
      workspace_id: workspaceId,
      project_id: projectId,
      title,
      description,
      status: 'todo',
      priority: 'medium',
      creator_id: user.id,
      position: nextPosition,
      assignee_id: assigneeId,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select(`
        *,
        assignee:users(id, full_name, avatar_url, email),
        project:projects(name, color)
      `)
      .single();

    if (error) throw error;

    // Send notification if task is assigned to someone
    if (assigneeId) {
      const { data: assigneeData, error: assigneeError } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('id', assigneeId)
        .single();

      if (assigneeData && !assigneeError) {
        // Create in-app notification
        await notificationApi.create({
          user_id: assigneeId,
          type: 'info',
          title: 'Task Assigned',
          message: `You have been assigned to task: ${data.title}`,
          action_url: `/dashboard/workspaces/${workspaceId}/tasks`,
        });

        // Send email notification
        const { data: workspaceData } = await supabase
          .from('workspaces')
          .select('name')
          .eq('id', workspaceId)
          .single();
          
        if (workspaceData) {
          await emailService.sendTaskAssignment(
            assigneeData as User, 
            data.title, 
            workspaceData.name
          );
        }
      }
    }

    return data;
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    // Get current task to check if assignee is changing
    const { data: currentTask } = await supabase
      .from('tasks')
      .select('assignee_id')
      .eq('id', taskId)
      .single();

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select(`
        *,
        assignee:users(id, full_name, avatar_url, email),
        project:projects(name, color)
      `)
      .single();

    if (error) throw error;

    // Send notification if task is assigned to someone new
    if (updates.assignee_id && updates.assignee_id !== currentTask?.assignee_id) {
      const { data: assigneeData, error: assigneeError } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('id', updates.assignee_id)
        .single();

      if (assigneeData && !assigneeError) {
        // Create in-app notification
        await notificationApi.create({
          user_id: updates.assignee_id,
          type: 'info',
          title: 'Task Assigned',
          message: `You have been assigned to task: ${data.title}`,
          action_url: `/dashboard/workspaces/${data.workspace_id}/tasks`,
        });

        // Send email notification
        const { data: workspaceData } = await supabase
          .from('workspaces')
          .select('name')
          .eq('id', data.workspace_id)
          .single();
          
        if (workspaceData) {
          await emailService.sendTaskAssignment(
            assigneeData as User, 
            data.title, 
            workspaceData.name
          );
        }
      }
    }

    return data;
  },

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
  },

  async reorderTasks(taskIds: string[]): Promise<void> {
    const updates = taskIds.map((id, index) => ({
      id,
      position: index,
    }));

    const { error } = await supabase
      .from('tasks')
      .upsert(updates);

    if (error) throw error;
  }
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