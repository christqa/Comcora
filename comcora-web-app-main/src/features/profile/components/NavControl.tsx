"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/login/hooks/AuthContext";
import { api } from "@/features/trpc-client/hooks/react";
import { skipToken, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Thumbnail } from "@/components/ui/thumbnail";

export const NavControl = () => {
  const { encryptedAccessPin, destroy } = useAuth();
  const queryClient = useQueryClient();

  const router = useRouter();
  const { t } = useTranslation();

  const { data, isLoading } = api.profile.retrieve.useQuery(
    Boolean(encryptedAccessPin) ? undefined : skipToken,
    {
      enabled: Boolean(encryptedAccessPin),
    }
  );

  const { mutateAsync: logout } = api.auth.logout.useMutation();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    destroy();
    router.push("/");
    await logout();
    queryClient.clear();
  };

  return (
    <DropdownMenu
      onOpenChange={(value: boolean) => setIsProfileDropdownOpen(value)}
    >
      <DropdownMenuTrigger asChild={true}>
        <Button
          aria-label={t("profile.dropdown.trigger")}
          variant={"transparent"}
          className="p-0"
        >
          <Thumbnail variant={"transparent"}>
            {!isLoading && data ? (
              <Avatar src={data.picture} size={"M"} alt={data.fullName} />
            ) : (
              <Skeleton className="mx-auto size-10 self-center rounded-xl bg-fill-black-a02" />
            )}
          </Thumbnail>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={"center"}
        className={"w-60 rounded-3xl border-0 bg-fill-primary p-0"}
        sideOffset={12}
      >
        <DropdownMenuItem className={"rounded-none p-4"}>
          <Link href={"/private/profile"}>{data?.fullName}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className={"rounded-none p-4"} disabled>
          <span>{t("profile.switchUser")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={"rounded-none p-4"}>
          <Button
            variant={"transparent"}
            className={"h-auto w-full justify-start p-0"}
            onClick={handleLogout}
          >
            <span className={"text-typography-critical"}>
              {t("profile.logout.title")}
            </span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuArrow className={"h-2 w-6 fill-fill-primary"} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
