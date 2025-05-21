import { MapControl, type ControlPosition } from "@vis.gl/react-google-maps";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type CustomZoomControlProps = {
  controlPosition: ControlPosition;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onGetCurrentLocation: (location: { lat: number; lng: number }) => void;
};

export const CustomControls = (props: CustomZoomControlProps) => {
  const { controlPosition, zoom, onZoomChange, onGetCurrentLocation } = props;

  function success(position: GeolocationPosition) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    onGetCurrentLocation({ lat: latitude, lng: longitude });
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
  };

  return (
    <MapControl position={controlPosition}>
      <div className={"fixed right-6 top-[96px] flex flex-col gap-8"}>
        <div className="flex flex-col gap-2">
          <Button
            variant={"primary"}
            size={"S"}
            className={"flex size-10 items-center justify-center p-0"}
            onClick={() => onZoomChange(zoom + 1)}
          >
            <Icon name={"24/Primary/Plus"} />
          </Button>
          <Button
            variant={"primary"}
            size={"S"}
            className={"flex size-10 items-center justify-center p-0"}
            onClick={() => onZoomChange(zoom - 1)}
          >
            <Icon name={"24/Primary/Minus"} />
          </Button>
        </div>
        {/*<Button*/}
        {/*  variant={"primary"}*/}
        {/*  size={"S"}*/}
        {/*  className={"flex size-10 items-center justify-center p-0"}*/}
        {/*  onClick={getCurrentLocation}*/}
        {/*>*/}
        {/*  <Icon name={"24/Primary/Location"} />*/}
        {/*</Button>*/}
      </div>
    </MapControl>
  );
};
