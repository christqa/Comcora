"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type PageProps = {
  contactId: string;
};

export default function AddBank(props: PageProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { contactId } = props;

  const onAdd = (event: React.MouseEvent) => {
    event.preventDefault();

    const query = {
      redirectUrl: `/private/payments/new-payment?userId=${contactId}`,
    };
    const queryString = new URLSearchParams(query).toString();

    router.push(`/private/contacts/edit-contact/${contactId}?${queryString}`);
  };

  return (
    <div className="flex w-[72px] flex-col gap-y-2">
      <div className="flex min-h-[72px] w-[72px] items-center justify-center rounded-3xl border-2 border-dashed border-fill-secondary-active">
        <Button variant="transparent" onClick={onAdd}>
          <Icon
            name={"24/Primary/Plus"}
            className="text-typography-secondary"
          />
        </Button>
      </div>
      <p className="text-center text-12-medium text-typography-primary">
        {t("common.buttonText.add")}
      </p>
    </div>
  );
}
