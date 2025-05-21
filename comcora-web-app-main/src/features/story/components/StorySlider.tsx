import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type RefObject,
} from "react";
import { SliderList } from "@/features/story/components/SliderList";
import { SliderPagination } from "@/features/story/components/SliderPagination";
import SliderProvider, {
  type SliderProviderHandle,
} from "@/features/story/lib/SliderContext";
import { useStory } from "@/features/story/lib/StoryContext";
import { type Story } from "@/features/story/types/story";

export type StorySliderHandle = {
  nextItem: () => void;
  previousItem: () => void;
};

type StorySliderProps = {
  items: Story[];
  onComplete: () => void;
  onAction: (action?: string) => void;
};

export const StorySlider = forwardRef<StorySliderHandle, StorySliderProps>(
  (props, ref) => {
    const { currentIndex, setCurrentIndex } = useStory();
    const { items, onComplete, onAction } = props;
    const sliderRefs = useRef<RefObject<SliderProviderHandle>[]>([]);
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      listRef.current?.scroll({
        left: listRef.current.clientWidth * currentIndex,
        behavior: "smooth",
      });
    }, [currentIndex]);

    useEffect(() => {
      const listElement = listRef.current!;
      const handleScrollEnd = () => {
        const index = Math.round(
          listElement.scrollLeft / listElement.clientWidth
        );
        setCurrentIndex(index);
      };
      listElement.addEventListener("scrollend", handleScrollEnd);
      return () => {
        listElement.removeEventListener("scrollend", handleScrollEnd);
      };
    }, [setCurrentIndex]);

    useEffect(() => {
      const listElement = listRef.current!;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = entry.target.getAttribute("data-index");
            sliderRefs.current[Number(index)]?.current?.pause(
              !entry.isIntersecting
            );
          });
        },
        { threshold: 1, root: listElement }
      );
      [].forEach.call(listElement.children, (child) => {
        observer.observe(child);
      });
      return () => {
        [].forEach.call(listElement.children, (child) => {
          observer.unobserve(child);
        });
      };
    }, []);

    const handleComplete = useCallback(
      (index: number) => {
        if (index < items.length - 1) {
          setCurrentIndex(index + 1);
        } else {
          onComplete();
        }
      },
      [items, onComplete, setCurrentIndex]
    );

    const handlePrevious = useCallback(
      (index: number) => {
        if (index > 0) {
          setCurrentIndex(index - 1);
        }
      },
      [setCurrentIndex]
    );

    const renderItem = useCallback(
      (item: Story, index: number) => {
        sliderRefs.current[index] =
          sliderRefs.current[index] ?? React.createRef();

        return (
          <SliderProvider
            ref={sliderRefs.current[index]}
            key={item.id}
            totalSlides={item.slides.length}
            onComplete={() => handleComplete(index)}
            onPrevious={() => handlePrevious(index)}
          >
            <div
              className={"relative flex h-full min-w-full snap-start"}
              data-index={index}
            >
              <SliderList slides={item.slides} onAction={onAction}></SliderList>
              <SliderPagination slidesCount={item.slides.length} />
            </div>
          </SliderProvider>
        );
      },
      [handleComplete, handlePrevious, onAction]
    );

    useImperativeHandle(ref, () => ({
      nextItem: () => {
        const sliderRef = sliderRefs.current[currentIndex]!;
        sliderRef.current?.next();
      },
      previousItem: () => {
        const sliderRef = sliderRefs.current[currentIndex]!;
        sliderRef.current?.previous();
      },
    }));

    return (
      <div
        ref={listRef}
        className={"flex w-full snap-x snap-mandatory overflow-x-auto"}
      >
        {items.map(renderItem)}
      </div>
    );
  }
);
StorySlider.displayName = "StorySlider";
