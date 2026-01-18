import { Loader2 } from "lucide-react";

export const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading content...</p>
      </div>
    </div>
  );
};
