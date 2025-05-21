import { useCallback, type PropsWithChildren } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AvatarUploaderProps = {
  onChange: (value: string) => void;
};

export function AvatarUploaderDialogContent(
  props: PropsWithChildren<AvatarUploaderProps>
) {
  const { t } = useTranslation();
  const { onChange } = props;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        if (selectedFile.size <= 10 * 1024 * 1024) {
          onChange(URL.createObjectURL(selectedFile));
        } else {
          alert("File size should not exceed 10MB");
        }
      }
    }
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/jpg": [".jpg", ".jpeg"],
    },
    multiple: false,
  });

  return (
    <DialogContent
      className={"w-full max-w-[38.125rem] gap-y-8"}
      variant={"light"}
    >
      <DialogHeader>
        <DialogTitle>{t("profile.changePhoto.profilePhoto")}</DialogTitle>
      </DialogHeader>
      <div
        {...getRootProps({
          className:
            "border-stroke-iron flex h-60 flex-col items-center justify-center gap-y-4 rounded-3xl border-2 border-dashed p-4",
        })}
      >
        <input {...getInputProps()} />

        <p className="text-center text-20-medium text-typography-primary">
          {t("profile.changePhoto.uploadOrDrop")}
        </p>
        <p className="text-center text-14-medium text-typography-secondary">
          {t("profile.changePhoto.photoFormat")}
          <br />
          png, jpg, jpeg
        </p>
      </div>
      <div className="flex items-center justify-center gap-x-4">
        <Button
          size="L"
          variant="accent"
          className="flex grow items-center justify-center rounded-2xl bg-fill-accent px-8 py-4"
          onClick={open}
        >
          {t("profile.changePhoto.addPhoto")}
        </Button>
      </div>
    </DialogContent>
  );
}
