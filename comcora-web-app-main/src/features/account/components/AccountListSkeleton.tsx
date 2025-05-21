import { Skeleton } from "@/components/ui/skeleton";

type AccountListSkeletonProps = {
  includeCards?: boolean;
  includeHeader?: boolean;
};

export function AccountListSkeleton(props: AccountListSkeletonProps) {
  const { includeCards, includeHeader } = props;

  return (
    <div
      className={`flex flex-col px-4 pb-2 ${includeHeader ? "pt-4" : "pt-2"}`}
    >
      {includeHeader && (
        <div className={"pb-4"}>
          <Skeleton className="h-4 w-2/4 rounded-lg bg-fill-primary-active" />
        </div>
      )}
      <div className={"flex flex-col gap-y-4"}>
        <div className="flex gap-x-2">
          <Skeleton className="size-10 rounded-xl bg-fill-primary-active" />
          <Skeleton className="h-10 flex-1 rounded-lg bg-fill-primary-active" />
        </div>
        {includeCards && (
          <div className="flex gap-x-2">
            <Skeleton className="size-10 rounded-lg bg-fill-primary-active" />
            <div className="flex flex-1 flex-col gap-y-2">
              <Skeleton className="h-10 w-full rounded-lg bg-fill-primary-active" />
              <div className="mt-2 flex gap-x-2">
                <Skeleton className="h-8 w-[50px] rounded-lg bg-fill-primary-active" />
                <Skeleton className="h-8 w-[50px] rounded-lg bg-fill-primary-active" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
