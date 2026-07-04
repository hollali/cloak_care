import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <>
      <div className="w-full space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-md" />
        ))}
      </div>
      <Skeleton className="h-96 w-full rounded-md" />
    </>
  );
}
