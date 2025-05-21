"use client";

import { useState } from "react";
import StickerDropdown from "@/features/payments/components/StickerDropdown";
import { type StickerResult } from "@/features/stickers/lib/types";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  useFormField,
} from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";

export default function StickerField() {
  const { t } = useTranslation();
  const { control, setValue } = useFormField();
  const [sticker, setSticker] = useState<StickerResult | null>(null);

  const handleStickerSelect = (value: StickerResult) => {
    setSticker(value);
    setValue("attachmentUrl", value?.media_formats.tinygif.url);
  };

  return (
    <FormField
      control={control}
      name={"reference"}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="relative z-20 flex flex-col gap-4">
              <Input
                className="h-14 rounded-2xl bg-fill-primary p-4"
                placeholder={t("common.credentials.addComment")}
                value={field.value}
                onChange={field.onChange}
                onClear={() => field.onChange("")}
                isPlaceholderNotTransformed
                clearable
              />
              <StickerDropdown
                onSelect={handleStickerSelect}
                comment={field.value}
              />
              {sticker?.id ? (
                <div className="sticker-preview relative size-fit">
                  <img
                    src={sticker.media_formats.tinygif.url}
                    alt={sticker.content_description}
                    className="aspect-square size-[114px] cursor-pointer rounded-2xl object-cover"
                  />

                  <Button
                    onClick={() => {
                      setSticker(null);
                      setValue("attachmentUrl", "");
                    }}
                    variant={"transparent"}
                    className="absolute right-2 top-2 z-10 size-fit p-0"
                    aria-label={t("common.buttonText.addSticker")}
                  >
                    <Icon
                      name={"24/Primary/CrossCircle"}
                      className="size-6 text-typography-surface"
                    />
                  </Button>
                </div>
              ) : null}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
