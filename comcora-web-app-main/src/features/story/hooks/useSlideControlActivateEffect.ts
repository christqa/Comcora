import { useCallback, useEffect, useRef } from "react";
import { easings, useSpringValue } from "@react-spring/web";

interface ActivateEffectParams {
  durationIn?: number;
  durationOut?: number;
  animationPaused?: boolean;
}

export default function useSlideControlActivateEffect(
  params: ActivateEffectParams = {}
) {
  const {
    durationIn = 5000,
    durationOut = 50,
    animationPaused = true,
  } = params;

  const scale = useSpringValue(0);
  const callbackRef = useRef<(() => void) | null>(null);

  const onEffectIn = useCallback(
    (callback: () => void) => {
      callbackRef.current = callback;
      if (animationPaused) {
        return;
      }
      const value = scale.get();
      const duration =
        value > 0 && value < 100
          ? durationIn - (value * durationIn) / 100
          : durationIn;
      scale
        .start({
          to: 100,
          from: value < 100 ? value : 0,
          config: {
            duration,
            easing:
              duration === durationIn ? easings.easeInOutCubic : easings.linear,
          },
          onRest: ({ finished, cancelled }) => {
            if (finished) {
              callbackRef.current = null;
              callback();
            }
          },
        })
        .catch(console.error);
    },
    [durationIn, scale, animationPaused]
  );

  const pauseAnimation = useCallback(() => {
    scale.stop();
  }, [scale]);

  const resumeAnimation = useCallback(() => {
    if (callbackRef.current) {
      onEffectIn(callbackRef.current);
    }
  }, [onEffectIn]);

  useEffect(() => {
    if (animationPaused) {
      pauseAnimation();
    } else {
      resumeAnimation();
    }
  }, [animationPaused, pauseAnimation, resumeAnimation, scale]);

  const onEffectOut = useCallback(() => {
    scale
      .start({
        to: 0,
        from: scale.get(),
        config: { duration: durationOut, easing: easings.easeInOutCubic },
      })
      .catch(console.error);
  }, [durationOut, scale]);

  const onEffectComplete = useCallback(() => {
    const value = scale.get();
    scale.finish();
    scale
      .start({
        to: 100,
        from: value,
        config: {
          duration: durationOut,
          easing: easings.easeInOutCubic,
        },
      })
      .catch(console.error);
  }, [durationOut, scale]);

  return {
    onEffectIn,
    onEffectOut,
    onEffectComplete,
    style: scale,
  };
}
