"use client";

import React, {
  useEffect,
  useState,
  type CSSProperties,
  type PropsWithChildren,
} from "react";
import { CardPlaceholder } from "@/features/cards/components/CardPlaceholder";

import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/IconButton";

import styles from "./CardSlider.module.css";

type PageProps = {
  defaultCardId?: string;
  handleActiveItemChange: (index: number) => void;
};

export function CardSlider(props: PropsWithChildren<PageProps>) {
  const { children, defaultCardId, handleActiveItemChange } = props;
  const total = React.Children.count(children);

  const getDefaultIndex = () => {
    return React.Children.toArray(children).findIndex((child) => {
      const element = child as React.ReactElement<{ data?: { id?: string } }>;
      return element.props.data?.id === defaultCardId;
    });
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const defaultIndex = getDefaultIndex();
    if (defaultIndex >= 0) {
      setCurrentIndex(defaultIndex);
    }
  }, [defaultCardId, children]);

  const next = () => {
    const index =
      currentIndex < total - 1 ? Math.min(currentIndex + 1, total - 1) : 0;
    handleActiveItemChange(index);
    setCurrentIndex(index);
  };

  const prev = () => {
    const index =
      currentIndex - 1 < 0 ? total - 1 : Math.max(currentIndex - 1, 0);
    handleActiveItemChange(index);
    setCurrentIndex(index);
  };

  return (
    <div className={cn("relative flex w-[41rem] flex-col", styles.host)}>
      <div className="flex justify-center gap-x-4">
        <div className={cn("relative w-full overflow-hidden", styles.wrapper)}>
          <div
            className={cn(
              "flex gap-4 transition-transform duration-300 ease-in-out",
              styles.slider
            )}
            style={
              {
                "--slider-active-index": currentIndex,
              } as CSSProperties
            }
          >
            <CardPlaceholder
              className={cn(styles.slide, styles.placeholderFirst)}
            />
            {React.Children.map(
              children,
              (child, index) =>
                child && (
                  <div
                    className={cn(
                      styles.slide,
                      currentIndex === index && styles.slideActive
                    )}
                    key={index}
                  >
                    {React.cloneElement(child as React.ReactElement)}
                  </div>
                )
            )}
            <CardPlaceholder
              className={cn(styles.slide, styles.placeholderLast)}
            />
          </div>
        </div>
        {total > 1 && (
          <>
            <IconButton
              noBackground
              iconName="24/Colored/Inverse/Left"
              onClick={prev}
              className={cn("absolute top-1/2 z-10", styles.controlPrev)}
            />
            <IconButton
              noBackground
              iconName="24/Colored/Inverse/Right"
              onClick={next}
              className={cn(" absolute top-1/2 z-10", styles.controlNext)}
            />
          </>
        )}
      </div>
      {total > 1 && (
        <div className="absolute left-1/2 top-full flex -translate-x-1/2">
          {React.Children.map(children, (_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`mx-1 block size-2 cursor-pointer rounded-full ${currentIndex === idx ? "bg-fill-accent" : "bg-fill-primary"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
