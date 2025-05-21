"use client";

import { type FC, type PropsWithChildren, type ReactNode } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type WithSheetProps = {
  bgImage?: string;
  disableCloseButton?: boolean;
  open: boolean;
  onClose: () => void;
  trigger: ReactNode;
  title: ReactNode | string;
  actionButtons?: ReactNode;
  handleScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  isScrolled?: boolean;
};

export const WithSheet: FC<WithSheetProps & PropsWithChildren> = ({
  open,
  onClose,
  trigger,
  children,
  title,
  actionButtons,
  bgImage,
  handleScroll,
  isScrolled,
}) => {
  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetTrigger asChild={true}>{trigger}</SheetTrigger>
      <SheetContent className="bg-fill-background-main p-0">
        {bgImage && (
          <div className="absolute">
            <img src={bgImage} />
          </div>
        )}
        <div className="flex h-full flex-col">
          <SheetTitle
            className={`bg-fill-main z-10 p-6 transition-all duration-200 ${
              isScrolled
                ? "rounded-b-lg border-b bg-fill-primary shadow-md"
                : ""
            }`}
          >
            {title}
          </SheetTitle>
          <ScrollArea onScroll={handleScroll} className="overflow-y-auto px-6">
            {children}
          </ScrollArea>
          <div className="relative">
            <div className="absolute inset-x-0 bottom-0 h-[24px] bg-gradient-fade"></div>
          </div>
          <div className="p-6">{actionButtons}</div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
