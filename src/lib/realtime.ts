import { supabase } from './supabase';
import { Task, Notification, ActivityFeed } from './supabase';

// Real-time service for handling subscriptions
class RealtimeService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subscriptions: Map<string, any> = new Map();

  // Subscribe to task changes in a workspace
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribeToTasks(workspaceId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`tasks-${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `workspace_id=eq.${workspaceId}`
        },
        callback
      )
      .subscribe();

    this.subscriptions.set(`tasks-${workspaceId}`, channel);
    return channel;
  }

  // Subscribe to notifications for a user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();

    this.subscriptions.set(`notifications-${userId}`, channel);
    return channel;
  }

  // Subscribe to activity feed in a workspace
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribeToActivity(workspaceId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`activity-${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_feed',
          filter: `workspace_id=eq.${workspaceId}`
        },
        callback
      )
      .subscribe();

    this.subscriptions.set(`activity-${workspaceId}`, channel);
    return channel;
  }

  // Subscribe to comments on a task
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribeToTaskComments(taskId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`comments-${taskId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'task_comments',
          filter: `task_id=eq.${taskId}`
        },
        callback
      )
      .subscribe();

    this.subscriptions.set(`comments-${taskId}`, channel);
    return channel;
  }

  // Unsubscribe from a specific channel
  unsubscribe(channelName: string) {
    const channel = this.subscriptions.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.subscriptions.delete(channelName);
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    this.subscriptions.forEach((channel, key) => {
      supabase.removeChannel(channel);
    });
    this.subscriptions.clear();
  }
}

export const realtimeService = new RealtimeService();