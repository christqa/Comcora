"use client";

import { useEffect, useState, type PropsWithChildren } from "react";
import { AvatarCropperDialogContent } from "@/features/profile/components/AvatarEditorDialog/AvatarCropperDialogContent";
import { AvatarUploaderDialogContent } from "@/features/profile/components/AvatarEditorDialog/AvatarUploaderDialogContent";
import { useProfile } from "@/features/profile/components/ProfileContext";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export function AvatarEditorDialog(props: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<string | null>(null);

  const { children } = props;

  useEffect(() => {
    if (!open) {
      setFile(null);
    }
  }, [open]);

  const { updatePhoto } = useProfile();

  const handleSubmitPhoto = async (photo: Blob) => {
    await updatePhoto(photo);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild={true}>{children}</DialogTrigger>
      {!file ? (
        <AvatarUploaderDialogContent onChange={(v) => setFile(v)} />
      ) : (
        <AvatarCropperDialogContent
          file={file}
          onReset={() => setFile(null)}
          onSubmit={handleSubmitPhoto}
        />
      )}
    </Dialog>
  );
}
