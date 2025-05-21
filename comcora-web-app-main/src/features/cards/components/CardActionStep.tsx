import { useTranslation } from "react-i18next";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icon, type IconName } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SheetTitle } from "@/components/ui/sheet";
import { Thumbnail } from "@/components/ui/thumbnail";

type DataProps = {
  label: string;
  value: string;
};

type PageProps = {
  data: DataProps[];
  onChange: (value: string) => void;
  type?: string;
  actionType?: string;
  sheetTitle: string;
  isAlertShown: boolean;
};

export function CardActionStep(props: PageProps) {
  const { t } = useTranslation();
  const { data, onChange, type, sheetTitle, actionType } = props;

  return (
    <>
      <SheetTitle>{sheetTitle}</SheetTitle>
      <div className="rounded-3xl bg-fill-primary p-2">
        <RadioGroup
          defaultValue="comfortable"
          className={"flex flex-col gap-2"}
          onValueChange={onChange}
        >
          {data.map((item) => {
            const icon = {
              mastercard: "cards/mastercard",
              visa: "cards/visa",
              unionpay: "cards/unionpay",
            }[item.value] as IconName;

            return (
              <div
                key={item.value}
                className="flex items-center justify-between p-2"
              >
                <div className="flex items-center gap-x-4">
                  <Thumbnail variant={"light"}>
                    {type === "cards" ? (
                      <Icon name={icon} />
                    ) : (
                      <Icon name={"24/Primary/More"} />
                    )}
                  </Thumbnail>
                  <Label htmlFor={item.value}>{item.label}</Label>
                </div>
                <RadioGroupItem
                  radioIconType={"rounded"}
                  value={item.value}
                  id={item.value}
                />
              </div>
            );
          })}
        </RadioGroup>
      </div>
      <Alert className={"rounded-2xl border-0 bg-fill-secondary-caution"}>
        <Icon
          name={"16/Primary/Warning"}
          className={"size-4 text-typography-caution"}
        />
        <AlertDescription className={"text-12-medium text-typography-caution"}>
          {actionType === "close"
            ? t("cards.messages.cardClose")
            : t("cards.messages.allCardWillBeBlocked")}
          {}
        </AlertDescription>
      </Alert>
    </>
  );
}
