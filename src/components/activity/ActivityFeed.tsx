import { useState, useEffect } from 'react';
import { realtimeService } from '@/lib/realtime';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Activity, User, Plus, Edit3, Trash2 } from 'lucide-react';

interface ActivityItem {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  action: string;
  entity_type: string;
  entity_name?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

interface ActivityFeedProps {
  workspaceId: string;
}

export const ActivityFeed = ({ workspaceId }: ActivityFeedProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time activity updates
    const channel = realtimeService.subscribeToActivity(workspaceId, (payload) => {
      const newActivity = {
        id: payload.new.id,
        user_id: payload.new.user_id,
        user_name: payload.new.metadata?.userName || 'Unknown User',
        user_avatar: payload.new.metadata?.userAvatar,
        action: payload.new.action,
        entity_type: payload.new.entity_type,
        entity_name: payload.new.metadata?.entityName,
        metadata: payload.new.metadata,
        created_at: payload.new.created_at,
      };
      
      setActivities(prev => [newActivity, ...prev]);
    });

    // Load initial activities (in a real app, you'd fetch from API)
    loadInitialActivities();

    // Cleanup subscription on unmount
    return () => {
      realtimeService.unsubscribe(`activity-${workspaceId}`);
    };
  }, [workspaceId]);

  const loadInitialActivities = () => {
    // Mock initial activities
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        user_id: 'user1',
        user_name: 'Alex Johnson',
        action: 'created',
        entity_type: 'task',
        entity_name: 'Design homepage',
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: '2',
        user_id: 'user2',
        user_name: 'Sam Wilson',
        action: 'completed',
        entity_type: 'task',
        entity_name: 'Setup database',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: '3',
        user_id: 'user3',
        user_name: 'Taylor Reed',
        action: 'commented',
        entity_type: 'task',
        entity_name: 'Fix login bug',
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
    ];
    
    setActivities(mockActivities);
    setLoading(false);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'updated':
      case 'edited':
        return <Edit3 className="h-4 w-4 text-blue-500" />;
      case 'deleted':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionText = (action: string, entityType: string) => {
    switch (action) {
      case 'created':
        return `created a new ${entityType}`;
      case 'updated':
      case 'edited':
        return `updated a ${entityType}`;
      case 'deleted':
        return `deleted a ${entityType}`;
      case 'completed':
        return `completed a ${entityType}`;
      case 'commented':
        return `commented on a ${entityType}`;
      default:
        return `${action} a ${entityType}`;
    }
  };

  return (
    <Card className="glass-card">
      <div className="p-6 border-b">
        <h3 className="text-lg font-bold">Activity Feed</h3>
      </div>
      <ScrollArea className="h-96">
        {loading ? (
          <div className="p-6 text-center text-muted-foreground">
            Loading activities...
          </div>
        ) : activities.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No recent activity
          </div>
        ) : (
          <div className="divide-y">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-muted/50">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {activity.user_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {getActionIcon(activity.action)}
                      <p className="text-sm font-medium truncate">
                        {activity.user_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getActionText(activity.action, activity.entity_type)}
                      </p>
                    </div>
                    {activity.entity_name && (
                      <p className="text-sm font-medium mt-1">
                        "{activity.entity_name}"
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};