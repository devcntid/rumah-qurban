"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MARKER_ICON = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function FlyTo({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, Math.max(map.getZoom(), 15), { duration: 0.8 });
  }, [map, center[0], center[1]]);
  return null;
}

export type LeafletMapProps = {
  center: [number, number];
  flyTo?: [number, number] | null;
  markerPos: [number, number] | null;
  onMapClick: (lat: number, lng: number) => void;
  onMarkerDragEnd: (lat: number, lng: number) => void;
};

export function LeafletMap({
  center,
  flyTo,
  markerPos,
  onMapClick,
  onMarkerDragEnd,
}: LeafletMapProps) {
  const markerRef = useRef<L.Marker | null>(null);

  const handleDragEnd = useCallback(() => {
    const m = markerRef.current;
    if (m) {
      const pos = m.getLatLng();
      onMarkerDragEnd(pos.lat, pos.lng);
    }
  }, [onMarkerDragEnd]);

  const eventHandlers = useMemo(
    () => ({ dragend: handleDragEnd }),
    [handleDragEnd],
  );

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom
      style={{ height: "220px", width: "100%", zIndex: 0 }}
      className="rounded-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <InvalidateSize />
      <ClickHandler onClick={onMapClick} />
      {flyTo && <FlyTo center={flyTo} />}
      {markerPos && (
        <Marker
          position={markerPos}
          icon={MARKER_ICON}
          draggable
          eventHandlers={eventHandlers}
          ref={markerRef}
        />
      )}
    </MapContainer>
  );
}
