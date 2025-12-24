import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { workspacesApi, projectsApi, tasksApi } from '@/lib/api';
import { Workspace, WorkspaceMember, Project, Task } from '@/lib/supabase';
import { ActivityFeed } from '@/components/activity/ActivityFeed';
import { Plus, Users, Calendar, MoreHorizontal, Mail, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Extended types to include related data
interface ExtendedWorkspaceMember extends WorkspaceMember {
  user: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

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

const WorkspaceDetail = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<ExtendedWorkspaceMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      loadWorkspaceData();
    }
  }, [workspaceId, loadWorkspaceData]);

  const loadWorkspaceData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load workspace details
      const workspaceData = await workspacesApi.getWorkspaces();
      const currentWorkspace = workspaceData.find(w => w.id === workspaceId);
      setWorkspace(currentWorkspace || null);
      
      // Load members
      const membersData = await workspacesApi.getWorkspaceMembers(workspaceId);
      setMembers(membersData);
      
      // Load projects
      const projectsData = await projectsApi.getProjects(workspaceId);
      setProjects(projectsData);
      
      // Load tasks
      const tasksData = await tasksApi.getTasks(workspaceId);
      setTasks(tasksData);
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to load workspace data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (workspaceId) {
      loadWorkspaceData();
    }
  }, [workspaceId, loadWorkspaceData]);

  const handleInviteMember = async () => {
    try {
      if (!inviteEmail.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Email is required.',
          variant: 'destructive',
        });
        return;
      }

      await workspacesApi.inviteMember(workspaceId!, inviteEmail);
      setIsInviteDialogOpen(false);
      setInviteEmail('');
      await loadWorkspaceData();
      
      toast({
        title: 'Success',
        description: 'Invitation sent successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to send invitation.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateProject = async () => {
    try {
      if (!newProject.name.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Project name is required.',
          variant: 'destructive',
        });
        return;
      }

      await projectsApi.createProject(workspaceId!, newProject.name, newProject.description);
      setIsCreateProjectDialogOpen(false);
      setNewProject({ name: '', description: '' });
      await loadWorkspaceData();
      
      toast({
        title: 'Success',
        description: 'Project created successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to create project.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await workspacesApi.removeMember(memberId);
      await loadWorkspaceData();
      
      toast({
        title: 'Success',
        description: 'Member removed successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to remove member.',
        variant: 'destructive',
      });
    }
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

  if (!workspace) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Workspace not found</h1>
            <Button variant="rocket" onClick={() => navigate('/dashboard/workspaces')}>
              Back to Workspaces
            </Button>
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
              <span className="gradient-text-orange">{workspace.name}</span>
            </h1>
            {workspace.description && (
              <p className="text-muted-foreground">{workspace.description}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Members
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Members</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="rocket" onClick={handleInviteMember}>
                      Send Invitation
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isCreateProjectDialogOpen} onOpenChange={setIsCreateProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="rocket">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Input
                      id="project-description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      placeholder="Enter description (optional)"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateProjectDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="rocket" onClick={handleCreateProject}>
                      Create Project
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Members Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Members</h2>
                <span className="text-sm text-muted-foreground">{members.length} members</span>
              </div>
              <Card className="glass-card p-6">
                <div className="flex flex-wrap gap-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center bg-muted rounded-full px-3 py-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold mr-2">
                        {member.user.full_name?.charAt(0) || member.user.email?.charAt(0) || 'U'}
                      </div>
                      <div className="mr-2">
                        <p className="text-sm font-medium">{member.user.full_name || member.user.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                      </div>
                      {member.user.id !== user?.id && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Projects Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Projects</h2>
                <span className="text-sm text-muted-foreground">{projects.length} projects</span>
              </div>
              {projects.length === 0 ? (
                <Card className="glass-card p-12 text-center">
                  <div className="mx-auto mb-4 text-muted-foreground">
                    <div className="bg-muted rounded-full p-4 inline-block">
                      <Plus className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first project to organize your tasks.
                  </p>
                  <Button variant="rocket" onClick={() => setIsCreateProjectDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card 
                      key={project.id} 
                      className="glass-card p-6 hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => navigate(`/dashboard/workspaces/${workspaceId}/projects/${project.id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold mb-1">{project.name}</h3>
                          {project.description && (
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Card 
                    className="glass-card p-6 border-2 border-dashed border-muted-foreground/50 hover:border-primary cursor-pointer flex items-center justify-center"
                    onClick={() => setIsCreateProjectDialogOpen(true)}
                  >
                    <div className="text-center">
                      <Plus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Create New Project</p>
                    </div>
                  </Card>
                </div>
              )}
            </div>

            {/* Recent Tasks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Recent Tasks</h2>
                <span className="text-sm text-muted-foreground">{tasks.length} tasks</span>
              </div>
              {tasks.length === 0 ? (
                <Card className="glass-card p-12 text-center">
                  <div className="mx-auto mb-4 text-muted-foreground">
                    <div className="bg-muted rounded-full p-4 inline-block">
                      <Plus className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">No tasks yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first task to get started.
                  </p>
                  <Button variant="rocket" onClick={() => navigate(`/dashboard/workspaces/${workspaceId}/tasks`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Task
                  </Button>
                </Card>
              ) : (
                <Card className="glass-card p-6">
                  <div className="space-y-4">
                    {tasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {task.project && (
                              <span className="inline-flex items-center mr-2">
                                <span 
                                  className="w-3 h-3 rounded-full mr-1" 
                                  style={{ backgroundColor: task.project.color || '#64748b' }}
                                ></span>
                                {task.project.name}
                              </span>
                            )}
                            {task.assignee && (
                              <span>Assigned to {task.assignee.full_name || task.assignee.email}</span>
                            )}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => navigate(`/dashboard/workspaces/${workspaceId}/tasks`)}>
                      View All Tasks
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Activity Feed Sidebar */}
          <div>
            <ActivityFeed workspaceId={workspaceId!} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WorkspaceDetail;