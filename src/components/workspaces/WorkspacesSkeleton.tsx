import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function WorkspacesSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar skeleton */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur h-16" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Workspaces grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="glass-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Footer skeleton */}
      <div className="h-64 border-t" />
    </div>
  );
}