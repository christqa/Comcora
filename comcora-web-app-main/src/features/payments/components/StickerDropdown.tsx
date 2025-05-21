"use client";

import React, { useCallback, useEffect, useState } from "react";
import type { StickerResult } from "@/features/stickers/lib/types";
import useStickers from "@/features/stickers/lib/use-stickers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import debounce from "lodash.debounce";
import { useTranslation } from "react-i18next";

import { randomId } from "@/lib/random-id";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

type PageProps = {
  onSelect: (sticker: StickerResult) => void;
  comment: string;
};

const categories = ["🤑", "🥵", "🫶", "🤘", "😍", "😇"];

export default function StickerDropdown(props: PageProps) {
  const { t } = useTranslation();
  const { onSelect, comment } = props;
  const { fetchStickers } = useStickers();

  const [open, setOpen] = useState(false);

  const [stickers, setStickers] = useState<StickerResult[]>([]);
  const [category, setCategory] = useState<string>("🤑");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState("");

  const onStickersLoaded = useCallback((data: StickerResult[]) => {
    if (data) {
      setStickers((prevStickers) => [...prevStickers, ...data]);
    } else {
      setStickers([]);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleCategoryClick = (category: string) => {
    setCategory(category);
    setSearchQuery("");
  };

  const debouncedHandleSearch = useCallback(() => {
    setStickers([]);
    const query = searchQuery ? searchQuery : category;
    fetchStickers(query, 21)
      .then(onStickersLoaded)
      .catch((error) => {
        console.error("Error fetching stickers:", error);
      });
  }, [fetchStickers, onStickersLoaded, searchQuery, category]);

  useEffect(() => {
    debouncedHandleSearch();
  }, [debouncedHandleSearch]);

  const handleOpenChange = useCallback((v: boolean) => setOpen(v), []);

  const onCategoryChange = (event: React.MouseEvent, item: string) => {
    event.preventDefault();
    handleCategoryClick(item);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="transparent"
          className={`absolute ${comment ? "right-12" : "right-4"} top-4 size-auto p-0`}
        >
          <Icon
            name={"24/Primary/StickerSmile"}
            className="size-6 text-typography-secondary"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={"w-[406px] rounded-3xl p-0 shadow-lg"}
        sideOffset={12}
      >
        <div className="flex flex-col gap-2 rounded-t-3xl bg-fill-primary-light p-4 pb-2">
          <div className="relative">
            <Input
              isPlaceholderNotTransformed
              className="h-10 rounded-xl bg-fill-primary p-2 px-10"
              placeholder={t("common.credentials.search")}
              onChange={handleInputChange}
              value={inputValue}
            />
            <Icon
              name={"24/Primary/Search"}
              className={"absolute left-2 top-2 size-6 text-icon-secondary"}
            />
          </div>
          <div className="flex gap-2">
            {categories.map((item) => (
              <Button
                key={item}
                variant={"transparent"}
                onClick={(e) => onCategoryChange(e, item)}
                className={`size-10 px-2.5 py-2 ${item === category ? "bg-fill-primary" : "bg-transparent"}`}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
        <div className="rounded-b-3xl bg-fill-primary">
          <ScrollArea maxHeight="340px">
            <div className="flex flex-wrap gap-4 p-4">
              {stickers.length ? (
                stickers.map((item: StickerResult) => (
                  <img
                    key={item.id + randomId()}
                    onClick={() => {
                      setOpen(false);
                      onSelect(item);
                    }}
                    src={item.media_formats.tinygif.url}
                    alt={item.content_description}
                    className="aspect-square size-[114px] cursor-pointer rounded-2xl object-cover"
                  />
                ))
              ) : (
                <>
                  <Skeleton className="size-[114px] rounded-2xl bg-fill-primary-active" />
                  <Skeleton className="size-[114px] rounded-2xl bg-fill-primary-active" />
                  <Skeleton className="size-[114px] rounded-2xl bg-fill-primary-active" />
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
