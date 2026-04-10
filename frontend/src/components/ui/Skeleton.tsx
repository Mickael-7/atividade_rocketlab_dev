interface Props {
  className?: string;
}

export function Skeleton({ className = "" }: Props) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
      <Skeleton className="h-40 rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-between mt-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Skeleton className="h-4 w-48" />
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden p-6 flex gap-6">
        <Skeleton className="h-56 w-72 rounded-xl shrink-0" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-3 w-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
