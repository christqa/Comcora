"use client";

import React, { useRef, useState } from "react";
import { SliderControls } from "@/features/story/components/SliderControls";
import { StoryCard } from "@/features/story/components/StoryCard";
import { StoryDialog } from "@/features/story/components/StoryDialog";
import {
  StorySlider,
  type StorySliderHandle,
} from "@/features/story/components/StorySlider";
import {
  getLocalizedStories,
  useStory,
} from "@/features/story/lib/StoryContext";
import { useTranslation } from "react-i18next";

import { IconButton } from "@/components/ui/IconButton";

export const StoryLine = () => {
  const { t, i18n } = useTranslation();
  const { stories: items, setCurrentIndex } = useStory();
  const [currentPaginationIndex, setCurrentPaginationIndex] = useState(0);
  const [dialogVisible, setDialogVisible] = useState(false);
  const sliderRef = useRef<StorySliderHandle | null>(null);
  const total = items.length;
  const localizedStories = getLocalizedStories(items, i18n.language);

  const next = () => {
    setCurrentPaginationIndex((prevIndex) => {
      if (prevIndex < total - 1) {
        return Math.min(prevIndex + 1, total - 1);
      }
      return 0;
    });
  };

  const prev = () => {
    setCurrentPaginationIndex((prevIndex) => {
      if (prevIndex - 1 < 0) {
        return total - 1;
      } else {
        return Math.max(prevIndex - 1, 0);
      }
    });
  };

  const handleAction = () => {
    setDialogVisible(false);
  };

  const handleStoryOpen = (index: number) => {
    setCurrentIndex(index);
    setDialogVisible(true);
  };

  const handleNextItem = () => {
    sliderRef.current?.nextItem();
  };

  const handlePreviousItem = () => {
    sliderRef.current?.previousItem();
  };

  return (
    <>
      <div className="relative pb-6">
        <IconButton
          noBackground
          iconName={"24/Colored/Inverse/Left"}
          onClick={prev}
          className="absolute left-0 top-1/2 z-10 -ml-4 -mt-3 -translate-y-1/2"
          aria-label={t("common.buttonText.previous")}
        />
        <IconButton
          noBackground
          iconName={"24/Colored/Inverse/Right"}
          onClick={next}
          className="absolute right-0 top-1/2 z-10 -mr-4 -mt-3 -translate-y-1/2"
          aria-label={t("common.buttonText.next")}
        />
        <div className="relative -mt-2 w-full overflow-hidden pt-2">
          {" "}
          <div
            className="flex gap-4 transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentPaginationIndex * (152 + 16)}px)`,
            }}
          >
            {" "}
            {localizedStories.map((story, index) => (
              <StoryCard
                {...story}
                key={`story-${story.id}`}
                onClick={() => handleStoryOpen(index)}
              />
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2">
          {localizedStories.map((story, index) => (
            <span
              key={`dot-${story.id}`}
              onClick={() => setCurrentPaginationIndex(index)}
              className={`mx-1 block size-2 cursor-pointer rounded-full ${currentPaginationIndex === index ? "bg-fill-accent" : "bg-fill-primary"}`}
            />
          ))}
        </div>
      </div>
      <StoryDialog
        Slider={
          <StorySlider
            ref={sliderRef}
            items={localizedStories}
            onComplete={() => setDialogVisible(false)}
            onAction={handleAction}
          />
        }
        Controls={
          <SliderControls onPrev={handlePreviousItem} onNext={handleNextItem} />
        }
        visible={dialogVisible}
        onVisibleChange={setDialogVisible}
      ></StoryDialog>
    </>
  );
};
