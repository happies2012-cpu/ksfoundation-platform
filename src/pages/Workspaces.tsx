import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { workspacesApi } from '@/lib/api';
import { Workspace, WorkspaceMember } from '@/lib/supabase';
import { Plus, Users, Calendar, MoreHorizontal } from 'lucide-react';
import { WorkspacesSkeleton } from '@/components/workspaces/WorkspacesSkeleton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Workspaces = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [members, setMembers] = useState<Record<string, WorkspaceMember[]>>({});
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '' });

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      const data = await workspacesApi.getWorkspaces();
      setWorkspaces(data);
      
      // Load members for each workspace
      const membersData: Record<string, WorkspaceMember[]> = {};
      for (const workspace of data) {
        const workspaceMembers = await workspacesApi.getWorkspaceMembers(workspace.id);
        membersData[workspace.id] = workspaceMembers;
      }
      setMembers(membersData);
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to load workspaces.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async () => {
    try {
      if (!newWorkspace.name.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Workspace name is required.',
          variant: 'destructive',
        });
        return;
      }

      await workspacesApi.createWorkspace(newWorkspace.name, newWorkspace.description);
      setIsCreateDialogOpen(false);
      setNewWorkspace({ name: '', description: '' });
      await loadWorkspaces();
      
      toast({
        title: 'Success',
        description: 'Workspace created successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to create workspace.',
        variant: 'destructive',
      });
    }
  };

  const handleWorkspaceSelect = (workspaceId: string) => {
    navigate(`/dashboard/workspaces/${workspaceId}`);
  };

  if (loading) {
    return <WorkspacesSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black">
            <span className="gradient-text-orange">Workspaces</span>
          </h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="rocket">
                <Plus className="mr-2 h-4 w-4" />
                New Workspace
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workspace</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Workspace Name</Label>
                  <Input
                    id="name"
                    value={newWorkspace.name}
                    onChange={(e) => setNewWorkspace({...newWorkspace, name: e.target.value})}
                    placeholder="Enter workspace name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newWorkspace.description}
                    onChange={(e) => setNewWorkspace({...newWorkspace, description: e.target.value})}
                    placeholder="Enter description (optional)"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="rocket" onClick={handleCreateWorkspace}>
                    Create
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {workspaces.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No workspaces yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first workspace to start collaborating with your team.
            </p>
            <Button variant="rocket" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Workspace
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {workspaces.map((workspace) => (
              <Card 
                key={workspace.id} 
                className="glass-card p-6 hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleWorkspaceSelect(workspace.id)}
                role="listitem"
                aria-label={`Workspace: ${workspace.name}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleWorkspaceSelect(workspace.id);
                  }
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{workspace.name}</h3>
                    {workspace.description && (
                      <p className="text-sm text-muted-foreground">{workspace.description}</p>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    aria-label="Workspace actions menu"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{members[workspace.id]?.length || 0} members</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Created {new Date(workspace.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Workspaces;