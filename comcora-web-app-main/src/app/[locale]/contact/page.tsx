"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAddresses from "@/features/contact/utils/useAddresses";

import "@/assets/styles/globals.css";

import Addresses from "@/features/contact/components/Addresses";
import AppBanner from "@/features/contact/components/AppBanner";
import GoogleMaps from "@/features/contact/components/GoogleMaps";
import LocationRequestDialog from "@/features/contact/components/LocationRequestDialog";
import {
  type LocationInfo,
  type Position,
} from "@/features/contact/types/contacts.types";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const DEFAULT_POSITION = { lat: 59.4189975339209, lng: 24.713067211091417 };

export default function ContactPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { addresses } = useAddresses();
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [selectedMarker, setSelectedMarker] = useState<Position | null>(
    DEFAULT_POSITION
  );
  const [zoom, setZoom] = useState(17);
  const [selectedLocationId, setSelectedLocationId] = useState(1);
  const [selectedLocationInfo, setSelectedLocationInfo] =
    useState<LocationInfo>(addresses[0] ?? ({} as LocationInfo));

  const handleMarkerClick = (marker: Position) => {
    setSelectedMarker(marker);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
  };

  const handlePositionChange = (
    marker: Position,
    id: number,
    info: LocationInfo
  ) => {
    setSelectedLocationInfo(info);
    setPosition(marker);
    setSelectedMarker(marker);
    setSelectedLocationId(id);
  };

  return (
    <>
      <LocationRequestDialog />
      <div className="fixed bottom-6 left-6 z-20 flex w-96 flex-col gap-4">
        <Addresses
          onPositionChanged={handlePositionChange}
          selectedId={selectedLocationId}
        />
        <AppBanner />
        <Button
          variant={"transparent"}
          onClick={() => router.back()}
          className={
            "fixed right-6 top-6 z-20 size-10 rounded-full bg-fill-surface-inverse p-0"
          }
          aria-label={t("common.buttonText.close")}
        >
          <Icon
            name={"24/Primary/Cross"}
            className={"size-6 text-typography-surface"}
          />
        </Button>
      </div>
      <GoogleMaps
        position={position}
        zoom={zoom}
        setZoom={setZoom}
        setPosition={setPosition}
        handleMarkerClick={handleMarkerClick}
        selectedMarker={selectedMarker}
        handleCloseInfoWindow={handleCloseInfoWindow}
        selectedLocationInfo={selectedLocationInfo}
      />
    </>
  );
}
