import React, { forwardRef } from "react";
import styles from "@/features/profile/components/AvatarCropper/AvatarCropper.module.css";
import { CustomWrapper } from "@/features/profile/components/AvatarCropper/AvatarCropperWrapper";
import {
  CircleStencil,
  Cropper,
  ImageRestriction,
  type CropperProps,
  type CropperRef,
} from "react-advanced-cropper";
import { type CropperWrapperComponent } from "react-advanced-cropper/dist/types";

export type CustomCropperProps = CropperProps;

export type CustomCropperRef = CropperRef;

export const CustomCropper = forwardRef<CustomCropperRef, CustomCropperProps>(
  ({ stencilProps, src, ...props }: CustomCropperProps, ref) => {
    return (
      <Cropper
        ref={ref}
        className={"h-[400px] w-full rounded-2xl"}
        stencilComponent={CircleStencil}
        imageRestriction={ImageRestriction.fitArea}
        wrapperComponent={CustomWrapper as unknown as CropperWrapperComponent}
        stencilProps={{
          ...stencilProps,
          aspectRatio: 1,
          movable: true,
          resizable: true,
          overlayClassName: styles.overlay,
          previewClassName: styles.preview,
          lines: {
            west: false,
            north: false,
            east: false,
            south: false,
          },
          handlers: {
            eastNorth: false,
            north: false,
            westNorth: false,
            west: false,
            westSouth: false,
            south: false,
            eastSouth: false,
            east: false,
          },
        }}
        src={src}
      />
    );
  }
);

CustomCropper.displayName = "CustomCropper";
