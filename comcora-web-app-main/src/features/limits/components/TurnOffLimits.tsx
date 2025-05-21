import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";

import { useLimits } from "../lib/LimitsContext";

type PageProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

export function TurnOffLimits(props: PageProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { open, setOpen } = props;
  const { setLimitsEnabled } = useLimits();
  const [loading, setLoading] = useState(false);

  const handleTurnOffLimits = async () => {
    setLoading(true);
    try {
      await setLimitsEnabled(false);

      toast({
        title: t("shared.limits.messages.limitDisabled"),
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: t("shared.limits.messages.limitDisableFailed"),
        description: t("shared.limits.messages.tryAgainLater"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogContent>
        <DialogHeader>
          <Icon
            className={"size-10 text-icon-critical"}
            name={"40/Caution/Warning"}
          />
          <DialogTitle>{t("shared.limits.areYouSure")}</DialogTitle>
          <DialogDescription>
            {t("shared.limits.limitDisableRisk")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"secondary-critical"}
            size={"L"}
            onClick={handleTurnOffLimits}
            disabled={loading}
          >
            {t("common.buttonText.send")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
