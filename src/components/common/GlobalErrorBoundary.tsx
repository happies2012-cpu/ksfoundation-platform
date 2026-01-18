import { useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface RouterError {
  statusText?: string;
  message?: string;
}

export const GlobalErrorBoundary = () => {
  const error = useRouteError() as RouterError;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4 text-center">
      <div className="p-4 rounded-full bg-destructive/10">
        <AlertTriangle className="w-12 h-12 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md">
        {error?.message || error?.statusText || "An unexpected error occurred. Please try again later."}
      </p>
      <Button onClick={() => window.location.reload()} variant="outline">
        Reload Page
      </Button>
    </div>
  );
};
