import { Skeleton } from "@/components/ui/skeleton";

export function TransactionsSkeleton() {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-between px-4 pb-4">
          <Skeleton className="h-4 w-2/4 rounded-lg bg-fill-primary-active" />
        </div>
        <div className="flex flex-col rounded-3xl bg-fill-primary">
          <div className="flex gap-4 rounded-2xl bg-fill-primary p-2">
            <Skeleton className="flex size-10 rounded-lg bg-fill-primary-active" />
            <div className="flex grow flex-col gap-y-2">
              <div className="flex gap-x-4">
                <Skeleton className="h-4 w-12 rounded-lg bg-fill-primary-active" />
                <div className="flex">
                  <Skeleton className="h-4 w-2/4 rounded-lg bg-fill-primary-active" />
                </div>
              </div>
              <span className="text-left text-12-medium text-typography-secondary">
                <Skeleton className="h-4 w-2/4 rounded-lg bg-fill-primary-active" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between px-4 pb-4">
          <Skeleton className="h-4 w-2/4 rounded-lg bg-fill-primary-active" />
        </div>
        <div className="flex flex-col rounded-3xl bg-fill-primary">
          <div className="flex gap-4 rounded-2xl bg-fill-primary p-2">
            <Skeleton className="flex h-10 w-12 rounded-lg bg-fill-primary-active" />
            <div className="flex grow flex-col gap-y-2">
              <div className="flex gap-x-4">
                <Skeleton className="h-4 w-10 rounded-lg bg-fill-primary-active" />
                <div className="flex">
                  <Skeleton className="h-4 w-2/4 rounded-lg bg-fill-primary-active" />
                </div>
              </div>
              <span className="text-left text-12-medium text-typography-secondary">
                <Skeleton className="h-4 w-2/4 rounded-lg bg-fill-primary-active" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
