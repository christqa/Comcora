import { useEffect, useRef } from "react";
import useSlideControlActivateEffect from "@/features/story/hooks/useSlideControlActivateEffect";
import { useSlider } from "@/features/story/lib/SliderContext";
import { animated } from "@react-spring/web";

type SliderPaginationControlProps = {
  index: number;
};

export const SliderPaginationControl = (
  props: SliderPaginationControlProps
) => {
  const { currentIndex, nextIndex, paused } = useSlider();
  const { index } = props;

  const inputState = useRef<boolean>(false);
  const isProgressIn = useRef<boolean>(false);
  const {
    onEffectOut,
    onEffectIn,
    onEffectComplete,
    style: width,
  } = useSlideControlActivateEffect({ animationPaused: paused });

  useEffect(() => {
    const current = index === currentIndex;
    const passed = index < currentIndex;
    inputState.current = current;
    if (current) {
      if (!isProgressIn.current) {
        isProgressIn.current = true;
        onEffectIn(() => {
          if (inputState.current) {
            isProgressIn.current = false;
            nextIndex();
          }
        });
      }
    } else if (!passed) {
      isProgressIn.current = false;
      onEffectOut();
    } else {
      isProgressIn.current = false;
      onEffectComplete();
    }
  }, [
    onEffectIn,
    onEffectOut,
    onEffectComplete,
    index,
    nextIndex,
    currentIndex,
  ]);

  return (
    <div className={"h-0.5 flex-1 rounded bg-white bg-opacity-40"}>
      <animated.div
        className={"h-0.5 flex-1 rounded bg-white"}
        style={{ width: width.to((value) => `${value}%`) }}
      ></animated.div>
    </div>
  );
};
