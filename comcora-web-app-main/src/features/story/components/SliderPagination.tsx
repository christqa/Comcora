import { SliderPaginationControl } from "@/features/story/components/SliderPaginationControl";

type SliderPaginationProps = {
  slidesCount: number;
};

export const SliderPagination = (props: SliderPaginationProps) => {
  const { slidesCount } = props;

  return (
    <div className={"absolute z-10 flex w-full flex-1 gap-x-1.5 p-4"}>
      {Array.from({ length: slidesCount }).map((_, index) => (
        <SliderPaginationControl
          key={index.toString()}
          index={index}
        ></SliderPaginationControl>
      ))}
    </div>
  );
};
