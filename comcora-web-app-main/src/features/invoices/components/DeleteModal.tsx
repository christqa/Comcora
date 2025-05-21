import { type VariantProps } from "class-variance-authority";
import { useTranslation } from "react-i18next";

import { Button, type buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";

type PageProps = {
  onDelete: () => void;
  onCancel?: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  description: string;
  btnText: string;
  title?: string;
  btnVariant?: VariantProps<typeof buttonVariants>["variant"];
};

export default function DeleteModal(props: PageProps) {
  const { t } = useTranslation();
  const {
    description,
    btnText,
    onDelete,
    open,
    setOpen,
    title,
    onCancel,
    btnVariant,
  } = props;

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <Icon
            className={"size-10 text-icon-critical"}
            name={"40/Caution/Warning"}
          />
          <DialogTitle>{title ?? t("common.dialog.sure")}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex gap-4">
            <Button
              variant={btnVariant ?? "secondary-critical"}
              className={"flex-1"}
              size={"L"}
              onClick={onDelete}
            >
              {btnText}
            </Button>
            {onCancel && (
              <Button
                variant={"secondary-critical"}
                onClick={onCancel}
                className={"flex-1"}
                size={"L"}
              >
                {t("common.buttonText.cancel")}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
