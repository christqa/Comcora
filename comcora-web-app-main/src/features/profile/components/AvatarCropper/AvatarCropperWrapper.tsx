import React, { type CSSProperties, type PropsWithChildren } from "react";
import { ScaleControl } from "@/features/profile/components/AvatarCropper/ScaleControl";
import {
  getAbsoluteZoom,
  getZoomFactor,
} from "advanced-cropper/extensions/absolute-zoom";
import cn from "classnames";
import { CropperFade, type CropperRef } from "react-advanced-cropper";

interface Props {
  cropper: CropperRef;
  loading: boolean;
  loaded: boolean;
  className?: string;
  style?: CSSProperties;
}

export const CustomWrapper = (props: PropsWithChildren<Props>) => {
  const { cropper, children, loaded, className } = props;
  const state = cropper.getState();

  const settings = cropper.getSettings();

  const absoluteZoom = getAbsoluteZoom(state, settings);

  const onZoom = (value: number, transitions?: boolean) => {
    cropper.zoomImage(getZoomFactor(state, settings, value), {
      transitions: !!transitions,
    });
  };

  return (
    <>
      <CropperFade
        className={cn("custom-wrapper", className)}
        visible={state && loaded}
      >
        {children}
      </CropperFade>

      <ScaleControl zoom={absoluteZoom} onChange={onZoom} />
    </>
  );
};
