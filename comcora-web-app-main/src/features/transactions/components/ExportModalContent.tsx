import { useTranslation } from "react-i18next";

import { Icon } from "@/components/ui/icon";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioOption } from "@/components/ui/radio-option";
import { Thumbnail } from "@/components/ui/thumbnail";

type PageProps = {
  setSelectedOption: (v: string) => void;
  selectedOption: string;
};

export const ExportModalContent = (props: PageProps) => {
  const { setSelectedOption, selectedOption } = props;
  const { t } = useTranslation();

  return (
    <div className="h-full rounded-2xl bg-fill-primary">
      <RadioGroup
        className="flex flex-col rounded-xl"
        value={selectedOption}
        onValueChange={setSelectedOption}
      >
        <RadioOption
          className="flex justify-between"
          id="pdf"
          value="pdf"
          radioIconType="rounded"
        >
          <div className="flex items-center gap-4">
            <Thumbnail>
              <Icon name="24/Primary/PDF" />
            </Thumbnail>
            <div>{t("transactions.pdfFile")}</div>
          </div>
        </RadioOption>
        <RadioOption
          className="flex justify-between"
          id="pdfsign"
          value="pdfsign"
          radioIconType="rounded"
        >
          <div className="flex items-center gap-4">
            <Thumbnail>
              <Icon name="24/Primary/PDFAndSign" />
            </Thumbnail>
            <div>{t("transactions.signedPdf")}</div>
          </div>
        </RadioOption>
      </RadioGroup>
    </div>
  );
};
