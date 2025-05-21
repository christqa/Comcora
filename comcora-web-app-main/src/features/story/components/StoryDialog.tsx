import React from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

type StoryDialogProps = {
  Slider: React.ReactNode;
  Controls: React.ReactNode;
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
};

export const StoryDialog = (props: StoryDialogProps) => {
  const { Slider, Controls, visible, onVisibleChange } = props;

  return (
    <Dialog open={visible} onOpenChange={onVisibleChange}>
      <DialogContent
        className={
          "flex w-auto max-w-none items-center bg-transparent p-0 shadow-none sm:rounded-none"
        }
      >
        <div
          className={
            "relative flex h-[608px] w-[336px] overflow-hidden rounded-2xl"
          }
        >
          {Slider}
        </div>
        {Controls}
      </DialogContent>
    </Dialog>
  );
};
