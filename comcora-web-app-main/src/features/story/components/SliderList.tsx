import { useSlider } from "@/features/story/lib/SliderContext";
import { type Slide } from "@/features/story/types/story";

import { Button } from "@/components/ui/button";

type SliderListProps = {
  slides: Slide[];
  onAction: (action?: string) => void;
};

export const SliderList = (props: SliderListProps) => {
  const { slides, onAction } = props;
  const { currentIndex, setPause } = useSlider();
  const { image, align, textBlocks, action } = slides[currentIndex]!;

  return (
    <div
      className={"flex flex-1"}
      onPointerDown={() => setPause(true)}
      onPointerUpCapture={() => setPause(false)}
    >
      <img src={image} alt="" className="absolute size-full object-cover" />
      <div
        className={`bg absolute size-full bg-gradient-to-b ${align === "bottom" ? "from-transparent to-black" : "from-black to-transparent"}`}
      ></div>
      <div className={"z-10 flex flex-1 flex-col gap-4 p-6"}>
        <div
          className={`flex flex-1 flex-col gap-4 ${align === "bottom" ? "justify-end" : "justify-start"}`}
        >
          {textBlocks.map((block, index) => (
            <span
              className={`${block.primary ? "text-40-medium tracking-[0.8px] text-white" : "text-14-medium leading-6 text-typography-secondary"} ${block.primary ?? block.bold ? "font-bold" : "font-normal"}`}
              key={index.toString()}
            >
              {block.text as string}
            </span>
          ))}
        </div>
        {action && (
          <div>
            <Button size={"S"} onClick={() => onAction(action?.type)}>
              <div className={"px-2"}> {action.label as string}</div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
