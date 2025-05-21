import { useMemo } from "react";
import { useStory } from "@/features/story/lib/StoryContext";
import { useTranslation } from "react-i18next";

import { IconButton } from "@/components/ui/IconButton";

type SliderControlsProps = {
  onPrev: () => void;
  onNext: () => void;
};

export const SliderControls = (props: SliderControlsProps) => {
  const { t } = useTranslation();
  const { onPrev, onNext } = props;

  const { currentSlideIndex, currentIndex, stories } = useStory();
  const hasNext = useMemo(() => {
    const hasNextSlide =
      (stories[currentIndex]?.slides.length ?? 0) > currentSlideIndex + 1;
    const hasNextStory = stories.length > currentIndex + 1;
    return hasNextSlide || hasNextStory;
  }, [currentIndex, currentSlideIndex, stories]);
  const hasPrev = useMemo(() => {
    return currentSlideIndex > 0 || currentIndex > 0;
  }, [currentIndex, currentSlideIndex]);

  return (
    <div className={"absolute flex size-full flex-col justify-center"}>
      <div className={"flex justify-between"}>
        <IconButton
          disabled={!hasPrev}
          className={"-translate-x-14"}
          iconName={"24/Primary/ArrowLeft"}
          onClick={onPrev}
        >
          <span className="sr-only">{t("stories.controls.previous")}</span>
        </IconButton>
        <IconButton
          disabled={!hasNext}
          className={"translate-x-14"}
          iconName={"24/Primary/ArrowRight"}
          onClick={onNext}
        >
          <span className="sr-only">{t("stories.controls.next")}</span>
        </IconButton>
      </div>
    </div>
  );
};
