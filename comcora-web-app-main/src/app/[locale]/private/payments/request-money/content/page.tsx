"use client";

import { PromoBanner } from "@/features/promo/components/PromoBanner";
import { useTranslation } from "react-i18next";

import { mockRequstMoneyLink } from "@/lib/mock-data";
import { formattedLink } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function Page() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleCopy = () => {
    void navigator.clipboard.writeText(mockRequstMoneyLink).then(() => {
      toast({
        title: t("accounts.messages.dataCopied"),
      });
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex-center flex w-full justify-center gap-10">
        <h1 className="w-[400px] text-center text-[32px] text-typography-primary">
          {`${t("payments.requestMoney.requestDescription")} 100 €`}
        </h1>
      </div>
      <div className="flex flex-row items-center justify-center gap-6 rounded-3xl bg-fill-primary p-2 px-3 shadow-m">
        <Icon name="24/Primary/Link" className="fill-surface-inverse size-6" />
        <h4 className="text-16-small flex text-center text-typography-primary">
          {formattedLink}
        </h4>
        <Button
          size="M"
          variant="default"
          className="flex items-center justify-center gap-x-2 rounded-xl bg-fill-accent px-6 py-3"
          onClick={handleCopy}
        >
          {t("common.buttonText.copy")}
        </Button>
      </div>
      <div className="flex-center flex w-full justify-center gap-10">
        <h4 className="w-[400px] text-center text-[24px] text-typography-primary">
          {t("common.buttonText.share")}
        </h4>
      </div>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col">
          <div className="m-2 flex size-[72px] flex-col items-center justify-center gap-6 rounded-3xl bg-fill-primary p-3 shadow-m">
            <Icon
              name="24/Logos/Telegram"
              className="fill-surface-inverse size-6 "
            />
          </div>
          <h6 className="text-center text-[12px] text-typography-primary">
            {"Telegram"}
          </h6>
        </div>
        <div className="flex flex-col">
          <div className="m-2 flex size-[72px] flex-col items-center justify-center gap-6 rounded-3xl bg-fill-primary p-3 shadow-m">
            <Icon
              name="24/Logos/WhatsApp"
              className="fill-surface-inverse size-6 "
            />
          </div>
          <h6 className="text-center text-[12px] text-typography-primary">
            {"WhatsApp"}
          </h6>
        </div>
        <div className="flex flex-col">
          <div className="m-2 flex size-[72px] flex-col items-center justify-center gap-6 rounded-3xl bg-fill-primary p-3 shadow-m">
            <Icon
              name="24/Logos/FaceBook"
              className="fill-surface-inverse size-6 "
            />
          </div>
          <h6 className="text-center text-[12px] text-typography-primary">
            {"Facebook"}
          </h6>
        </div>
        <div className="flex flex-col">
          <div className="m-2 flex size-[72px] flex-col items-center justify-center gap-6 rounded-3xl bg-fill-primary p-3 shadow-m">
            <Icon name="24/Logos/X" className="fill-surface-inverse size-6 " />
          </div>
          <h6 className="text-center text-[12px] text-typography-primary">
            {"X"}
          </h6>
        </div>
      </div>
      <PromoBanner />
    </div>
  );
}
