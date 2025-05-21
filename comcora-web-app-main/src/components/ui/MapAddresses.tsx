"use client";

import { useEffect, useRef, useState } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useTranslation } from "react-i18next";

import {
  EditableInput,
  type EditableInputProps,
} from "@/components/ui/editable-input";

const API_KEY = process.env.GEOCODING_API_KEY;

interface AddressesProps extends Partial<PlaceAutocompleteProps> {
  handleAddressChange: (v: google.maps.places.PlaceResult | null) => void;
  isDirty?: boolean;
  onSave?: () => void;
  loading: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

export default function Addresses({
  handleAddressChange,
  isDirty,
  onSave,
  clearable,
  onClear,
  loading,
  ...props
}: AddressesProps) {
  return (
    <APIProvider apiKey={API_KEY ?? ""}>
      <div className="autocomplete-control">
        <PlaceAutocomplete
          onPlaceSelect={(value: google.maps.places.PlaceResult | null) => {
            handleAddressChange(value);
          }}
          isDirty={isDirty}
          onSave={onSave}
          loading={loading}
          clearable={clearable}
          onClear={onClear}
          {...props}
        />
      </div>
    </APIProvider>
  );
}

interface PlaceAutocompleteProps extends EditableInputProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  isDirty?: boolean;
  onSave?: () => void;
  loading: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

const PlaceAutocomplete = ({
  onPlaceSelect,
  isDirty,
  onSave,
  loading,
  clearable,
  onClear,
  ...props
}: PlaceAutocompleteProps) => {
  const { t } = useTranslation();

  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["name", "formatted_address", "address_components"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container">
      <EditableInput
        listItemVariant={"default"}
        placeholder={t("common.credentials.residentialAddress")}
        ref={inputRef}
        onSave={onSave}
        loading={loading}
        isDirty={isDirty}
        clearable={clearable}
        onClear={onClear}
        {...props}
      />
    </div>
  );
};
