import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
  type PropsWithChildren,
} from "react";
import { useStory } from "@/features/story/lib/StoryContext";

export interface SliderContextMethods {
  currentIndex: number;
  paused: boolean;
  nextIndex: () => void;
  previousIndex: () => void;
  setPause: (pause: boolean) => void;
}
export const SliderContext = createContext<SliderContextMethods>({
  currentIndex: 0,
  paused: true,
  nextIndex: () => void 0,
  previousIndex: () => void 0,
  setPause: () => void 0,
});

export interface SliderProviderProps {
  totalSlides: number;
  repeat?: boolean;
  onComplete: () => void;
  onPrevious: () => void;
}
export interface SliderProviderHandle {
  previous: () => void;
  next: () => void;
  reset: () => void;
  pause: (pause: boolean) => void;
  isPaused: boolean;
}

const SliderProvider = forwardRef<
  SliderProviderHandle,
  PropsWithChildren<SliderProviderProps>
>((props, ref) => {
  const { setCurrentSlideIndex } = useStory();
  const { totalSlides, repeat, onComplete, onPrevious, children } = props;
  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(true);

  useEffect(() => {
    if (!pause) {
      setCurrentSlideIndex(index);
    }
  }, [index, setCurrentSlideIndex, pause]);

  const nextIndex = useCallback(() => {
    if (index < totalSlides - 1) {
      setIndex((prevState) => prevState + 1);
    } else {
      if (repeat) {
        setIndex(0);
      } else {
        onComplete();
      }
    }
  }, [index, onComplete, repeat, totalSlides]);

  const previousIndex = useCallback(() => {
    if (index > 0) {
      setIndex((prevState) => prevState - 1);
    } else {
      if (repeat) {
        setIndex(totalSlides - 1);
      } else {
        onPrevious();
      }
    }
  }, [index, repeat, totalSlides, onPrevious]);

  useImperativeHandle(
    ref,
    () => ({
      previous: () => previousIndex(),
      next: () => nextIndex(),
      reset: () => setIndex(0),
      pause: setPause,
      isPaused: pause,
      index,
    }),
    [nextIndex, pause, previousIndex, index]
  );

  const context: SliderContextMethods = {
    currentIndex: index,
    nextIndex: nextIndex,
    previousIndex,
    paused: pause,
    setPause,
  };

  return (
    <SliderContext.Provider value={context}>{children}</SliderContext.Provider>
  );
});
SliderProvider.displayName = "SliderProvider";

export const useSlider = () => useContext(SliderContext);
export default SliderProvider;
