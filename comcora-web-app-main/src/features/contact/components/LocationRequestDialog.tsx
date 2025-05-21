"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LocationRequestDialog = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const locationGranted = localStorage.getItem("locationGranted");
    if (!locationGranted) {
      setOpen(true);
    }
  }, []);

  const handleAllowCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location granted:", position);
          localStorage.setItem("locationGranted", "true");
          setOpen(false);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogContent className={"top-[48%] w-[400px]"}>
        <DialogHeader>
          <DialogTitle>{t("contacts.locationDetails")}</DialogTitle>
          <DialogDescription>
            {t("contacts.site")}
            <Link
              href={"https://www.xdatagroup.io/"}
              className={"mx-1 text-typography-success"}
            >
              https://www.xdatagroup.io/
            </Link>
            {t("contacts.accessForYourLocation")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={"flex flex-row gap-x-4"}>
          <Button
            variant={"accent"}
            size={"L"}
            className={"h-14 w-[160px]"}
            onClick={handleAllowCurrentLocation}
          >
            {t("common.buttonText.allow")}
          </Button>
          <Button
            variant={"primary-inverse"}
            size={"L"}
            className={"h-14 w-[160px]"}
            onClick={() => setOpen(false)}
          >
            {t("common.buttonText.block")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationRequestDialog;
