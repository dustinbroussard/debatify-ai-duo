export const LoadingSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4 animate-shimmer" />
      <div className="h-4 bg-muted rounded w-1/2 animate-shimmer" />
      <div className="h-4 bg-muted rounded w-5/6 animate-shimmer" />
      <div className="h-4 bg-muted rounded w-2/3 animate-shimmer" />
    </div>
  );
};