import { CustomControls } from "@/features/contact/components/CustomControls";
import LocationIndicator from "@/features/contact/components/LocationIndicator";
import {
  type LocationInfo,
  type Position,
} from "@/features/contact/types/contacts.types";
import darkStyles from "@/features/contact/utils/googleStyles";
import {
  APIProvider,
  ControlPosition,
  InfoWindow,
  Map,
  Marker,
} from "@vis.gl/react-google-maps";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

type PageProps = {
  position: Position;
  zoom: number;
  setZoom: (v: number) => void;
  setPosition: (v: Position) => void;
  handleMarkerClick: (v: Position) => void;
  selectedMarker: Position | null;
  handleCloseInfoWindow: () => void;
  selectedLocationInfo: LocationInfo;
};

export default function GoogleMaps(props: PageProps) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const {
    position,
    zoom,
    setZoom,
    setPosition,
    handleMarkerClick,
    selectedMarker,
    handleCloseInfoWindow,
    selectedLocationInfo,
  } = props;

  const { theme } = useTheme();
  const customIcon = {
    url: "/PinMap.svg",
  };

  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  return (
    <APIProvider apiKey={API_KEY ?? ""} language={currentLanguage}>
      <Map
        fullscreenControl={false}
        defaultCenter={position}
        styles={theme === "dark" ? darkStyles : null}
        disableDefaultUI={true}
        zoom={zoom}
        onZoomChanged={(ev) => setZoom(ev.detail.zoom)}
        style={{ width: "100vw", height: "100vh" }}
      >
        <CustomControls
          controlPosition={ControlPosition.TOP_RIGHT}
          zoom={zoom}
          onZoomChange={(zoom) => setZoom(zoom)}
          onGetCurrentLocation={(location) => setPosition(location)}
        />
        <Marker
          icon={customIcon}
          position={position}
          onClick={() => handleMarkerClick(position)}
        />
        <InfoWindow
          pixelOffset={[0, -40]}
          position={selectedMarker}
          onCloseClick={handleCloseInfoWindow}
        >
          <LocationIndicator
            locationInfo={selectedLocationInfo}
            handleCloseInfoWindow={handleCloseInfoWindow}
          />
        </InfoWindow>
      </Map>
    </APIProvider>
  );
}
