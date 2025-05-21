import { type Story } from "@/features/story/types/story";

type StoryCardProps = {
  onClick: () => void;
} & Pick<Story, "read" | "title" | "picture">;

export function StoryCard(props: StoryCardProps) {
  const { read, title, picture, onClick } = props;
  return (
    <div
      className={`relative flex shrink-0 cursor-pointer items-end justify-between rounded-3xl border-2 p-1.5 transition duration-200 ease-in-out hover:-translate-y-2 ${read ? "border-stroke-secondary-active" : "border-stroke-accent"}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="size-[8.5rem] rounded-2xl">
          <img
            src={picture}
            alt=""
            className={"size-full rounded-2xl object-cover"}
          />
        </div>
        <div className="absolute flex size-[8.5rem] flex-col justify-end gap-y-2.5 rounded-2xl bg-gradient-opacity p-3">
          <div className="flex justify-end gap-x-2.5">
            <span className="grow text-14-medium text-typography-surface">
              {title as string}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
