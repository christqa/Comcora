import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { type CropperRef } from "react-advanced-cropper";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import "react-advanced-cropper/dist/style.css";

import { CustomCropper } from "@/features/profile/components/AvatarCropper/AvatarCropper";
import { useProfile } from "@/features/profile/components/ProfileContext";
import { useTranslation } from "react-i18next";

type PhotoCropperDialogContentProps = {
  file?: string;
  onReset?: () => void;
  onSubmit?: (data: Blob) => void;
};

export function AvatarCropperDialogContent(
  props: PropsWithChildren<PhotoCropperDialogContentProps>
) {
  const { t } = useTranslation();
  const { file: inputFile, onReset, onSubmit } = props;
  const cropperRef = useRef<CropperRef>(null);
  const [file, setFile] = useState<null | string>();

  const {} = useProfile();
  useEffect(() => {
    setTimeout(() => {
      setFile(inputFile);
    }, 200);
  }, [inputFile]);

  const onSave = () => {
    cropperRef.current?.getCanvas()?.toBlob((data) => {
      if (data && onSubmit) {
        onSubmit(data);
      }
    });
  };

  return (
    <DialogContent
      className={"w-full max-w-[38.125rem] gap-y-8"}
      variant={"light"}
    >
      <div className="flex flex-col justify-center gap-y-4">
        <DialogHeader>
          <DialogTitle>{t("profile.changePhoto.edit")}</DialogTitle>
        </DialogHeader>
        <p className="grow text-center text-16-medium text-typography-primary">
          {t("profile.changePhoto.placeImage")}
        </p>
      </div>

      <CustomCropper ref={cropperRef} src={file} />

      <div className="flex items-center justify-center gap-x-4">
        <Button
          size="L"
          variant="primary"
          className="flex grow"
          onClick={onReset}
        >
          {t("profile.changePhoto.chooseAnother")}
        </Button>

        <Button
          size="L"
          variant="accent"
          className="flex grow"
          onClick={onSave}
        >
          {t("common.buttonText.save")}
        </Button>
      </div>
    </DialogContent>
  );
}
