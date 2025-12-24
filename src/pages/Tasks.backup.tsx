import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  DndContext, 
  DragEndEvent, 
  KeyboardSensor, 
  PointerSensor, 
  closestCorners,
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  Button } from '@/components/ui/button';
import { 
  Card } from '@/components/ui/card';
import { 
  Input } from '@/components/ui/input';
import { 
  Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  useAuth } from '@/contexts/AuthContext';
import { 
  toast } from '@/hooks/use-toast';
import { 
  tasksApi, 
  projectsApi 
} from '@/lib/api';
import { 
  realtimeService 
} from '@/lib/realtime';
import { 
  Task, 
  Project 
} from '@/lib/supabase';
import { 
  Plus, 
  Calendar, 
  Paperclip, 
  User, 
  Flag, 
  GripVertical,
  X,
  Upload
} from 'lucide-react';
import { 
  SortableTaskItem 
} from '@/components/tasks/SortableTaskItem';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Extend Task type to include related data
/*interface ExtendedTask extends Task {
  project?: {
    name: string;
    color: string | null;
  };
  assignee?: {
    full_name: string | null;
    email: string;
  };
}*/
type ExtendedTask = Task & {
  project?: {
    name: string;
    color: string | null;
  };
  assignee?: {
    full_name: string | null;
    email: string;
  };
}
const Tasks = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    dueDate: ''
  });
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    projectId: 'all',
    search: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );



  const loadTasksAndProjects = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load tasks
      const tasksData = await tasksApi.getTasks(workspaceId!);
      setTasks(tasksData);
      
      // Load projects
      const projectsData = await projectsApi.getProjects(workspaceId!);
      setProjects(projectsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to load tasks and projects.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);



  const handleCreateTask = async () => {
    try {
      if (!newTask.title.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Task title is required.',
          variant: 'destructive',
        });
        return;
      }

      await tasksApi.createTask(
        workspaceId!,
        newTask.projectId || null,
        newTask.title,
        newTask.description
      );
      
      setIsCreateDialogOpen(false);
      setNewTask({
        title: '',
        description: '',
        projectId: '',
        priority: 'medium',
        dueDate: ''
      });
      
      // Note: Real-time subscription will update the UI automatically
      
      toast({
        title: 'Success',
        description: 'Task created successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to create task.',
        variant: 'destructive',
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });

      // Update positions in database
      try {
        const reorderedTasks = arrayMove(tasks, 
          tasks.findIndex(item => item.id === active.id),
          tasks.findIndex(item => item.id === over.id)
        );
        
        const taskIds = reorderedTasks.map(task => task.id);
        await tasksApi.reorderTasks(taskIds);
      } catch (error) {
        toast({
          title: 'Error',
          description: (error as Error).message || 'Failed to reorder tasks.',
          variant: 'destructive',
        });
        // Reload tasks to restore previous order
        loadTasksAndProjects();
      }
    }
  };

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      const updatedTask = await tasksApi.updateTask(taskId, { status });
      
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      ));
      
      toast({
        title: 'Success',
        description: 'Task status updated!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to update task status.',
        variant: 'destructive',
      });
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.projectId !== 'all' && task.project_id !== filters.projectId) return false;
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) && 
          !(task.description && task.description.toLowerCase().includes(filters.search.toLowerCase()))) return false;
      return true;
    });
  }, [tasks, filters]);

  const tasksByStatus = useMemo(() => {
    const statuses: Task['status'][] = ['todo', 'in_progress', 'review', 'done'];
    return statuses.reduce((acc, status) => {
      acc[status] = filteredTasks.filter(task => task.status === status);
      return acc;
    }, {} as Record<Task['status'], ExtendedTask[]>);
  }, [filteredTasks]);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'urgent': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const exportTasksToCSV = () => {
    // Create CSV content
    const headers = [
      'ID',
      'Title',
      'Description',
      'Status',
      'Priority',
      'Project',
      'Assignee',
      'Due Date',
      'Created At'
    ];
    
    const rows = tasks.map(task => [
      task.id,
      task.title,
      task.description || '',
      task.status,
      task.priority,
      task.project?.name || '',
      task.assignee?.full_name || '',
      task.due_date || '',
      task.created_at
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Export Successful',
      description: 'Tasks exported to CSV file successfully!',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">
              <span className="gradient-text-orange">Tasks</span>
            </h1>
            <p className="text-muted-foreground">Manage your team's tasks and projects</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => exportTasksToCSV()}>
              Export CSV
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="rocket">
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Enter task title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Enter description (optional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project">Project</Label>
                    <Select 
                      value={newTask.projectId} 
                      onValueChange={(value) => setNewTask({...newTask, projectId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={newTask.priority} 
                      onValueChange={(value) => setNewTask({...newTask, priority: value as 'low' | 'medium' | 'high' | 'urgent'})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="rocket" onClick={handleCreateTask}>
                      Create Task
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="glass-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                aria-label="Search tasks"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters({...filters, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select 
                value={filters.priority} 
                onValueChange={(value) => setFilters({...filters, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Project</Label>
              <Select 
                value={filters.projectId} 
                onValueChange={(value) => setFilters({...filters, projectId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setFilters({ status: 'all', priority: 'all', projectId: 'all', search: '' })}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          accessibility={{
            announcements: {
              onDragStart(id) {
                return `Picked up draggable item ${id}`;
              },
              onDragOver({ active, over }) {
                return `Draggable item ${active.id} is over droppable area ${over?.id || 'nothing'}`;
              },
              onDragEnd({ active, over }) {
                return `Draggable item ${active.id} was dropped over droppable area ${over?.id || 'nothing'}`;
              },
              onDragCancel(id) {
                return `Dragging was cancelled. Draggable item ${id} was dropped.`;
              }
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
            {(['todo', 'in_progress', 'review', 'done'] as const).map((status) => (
              <div key={status} className="space-y-4" role="listitem">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold capitalize" id={`${status}-column`}>
                    {status.replace('_', ' ')} ({tasksByStatus[status].length})
                  </h2>
                </div>
                <Card className="glass-card p-4 min-h-[200px]" aria-labelledby={`${status}-column`}>
                  <SortableContext 
                    items={tasksByStatus[status].map(t => t.id)} 
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3" role="list">
                      {tasksByStatus[status].map((task) => (
                        <SortableTaskItem
                          key={task.id}
                          task={task}
                          onUpdateStatus={updateTaskStatus}
                          getPriorityColor={getPriorityColor}
                        />
                      ))}
                      
                      {tasksByStatus[status].length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No tasks here</p>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </Card>
              </div>
            ))}
          </div>
        </DndContext>
      </div>
      <Footer />
    </div>
  );
};

export default Tasks;