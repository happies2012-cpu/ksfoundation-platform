import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Calendar, 
  Paperclip, 
  User, 
  Flag, 
  GripVertical,
  MoreHorizontal
} from 'lucide-react';

interface ExtendedTask extends Task {
  project?: {
    name: string;
    color: string | null;
  };
  assignee?: {
    full_name: string | null;
    email: string;
  };
}

interface SortableTaskItemProps {
  task: ExtendedTask;
  onUpdateStatus: (taskId: string, status: Task['status']) => void;
  getPriorityColor: (priority: Task['priority']) => string;
}

export const SortableTaskItem = ({ 
  task, 
  onUpdateStatus,
  getPriorityColor
}: SortableTaskItemProps) => {
  const [showActions, setShowActions] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    onUpdateStatus(task.id, newStatus);
    setShowActions(false);
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      role="listitem"
      aria-label={`Task: ${task.title}, Status: ${task.status}, Priority: ${task.priority}`}
      tabIndex={0}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <div 
            {...attributes} 
            {...listeners}
            className="mr-2 cursor-grab active:cursor-grabbing"
            aria-label="Drag to reorder task"
            role="button"
            tabIndex={0}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-sm">{task.title}</h3>
        </div>
        
        {(showActions || task.assignee) && (
          <div className="flex items-center space-x-1">
            {task.assignee && (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  aria-label="Task actions menu"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" role="menu">
                <DropdownMenuItem 
                  onSelect={() => handleStatusChange('todo')}
                  role="menuitem"
                >
                  Move to To Do
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => handleStatusChange('in_progress')}
                  role="menuitem"
                >
                  Move to In Progress
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => handleStatusChange('review')}
                  role="menuitem"
                >
                  Move to Review
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => handleStatusChange('done')}
                  role="menuitem"
                >
                  Move to Done
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          <Flag className={`h-3 w-3 mr-1 ${getPriorityColor(task.priority)}`} />
          <span className="capitalize">{task.priority}</span>
        </div>
        
        {task.due_date && (
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>
      
      {task.project && (
        <div className="mt-2 flex items-center">
          <span 
            className="w-2 h-2 rounded-full mr-1" 
            style={{ backgroundColor: task.project.color || '#64748b' }}
          ></span>
          <span className="text-xs text-muted-foreground">{task.project.name}</span>
        </div>
      )}
    </Card>
  );
};