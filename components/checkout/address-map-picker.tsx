"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Search, MapPin, Loader2 } from "lucide-react";

const LeafletMap = dynamic(
  () => import("./leaflet-map").then((m) => m.LeafletMap),
  { ssr: false, loading: () => <div className="h-[220px] w-full rounded-md bg-slate-200 animate-pulse" /> }
);

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

async function geocodeSearch(query: string): Promise<NominatimResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id&limit=5`;
  const res = await fetch(url, { headers: { "Accept-Language": "id" } });
  if (!res.ok) return [];
  return res.json();
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
  const res = await fetch(url, { headers: { "Accept-Language": "id" } });
  if (!res.ok) return "";
  const data = await res.json();
  return data.display_name ?? "";
}

export type MapSelection = {
  lat: number;
  lng: number;
  address: string;
};

export function AddressMapPicker({
  initialCenter,
  value,
  onSelect,
}: {
  initialCenter?: [number, number];
  value: string;
  onSelect: (selection: MapSelection) => void;
}) {
  const center: [number, number] = initialCenter ?? [-6.9175, 107.6191];
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [reverseLoading, setReverseLoading] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePlacePin = useCallback(
    async (lat: number, lng: number) => {
      setMarkerPos([lat, lng]);
      setResults([]);
      setReverseLoading(true);
      try {
        const addr = await reverseGeocode(lat, lng);
        onSelect({ lat, lng, address: addr });
      } catch {
        onSelect({ lat, lng, address: "" });
      } finally {
        setReverseLoading(false);
      }
    },
    [onSelect]
  );

  const handleSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 3) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await geocodeSearch(trimmed);
      setResults(res);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (newValue: string) => {
      onSelect({ lat: 0, lng: 0, address: newValue });

      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(newValue);
      }, 500);
    },
    [onSelect, handleSearch]
  );

  const handleSelectResult = useCallback(
    (r: NominatimResult) => {
      const lat = parseFloat(r.lat);
      const lng = parseFloat(r.lon);
      setMarkerPos([lat, lng]);
      setFlyTarget([lat, lng]);
      setResults([]);
      onSelect({ lat, lng, address: r.display_name });
    },
    [onSelect]
  );

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Ketik alamat lengkap atau cari lokasi..."
          className="w-full border border-slate-300 rounded-md py-2.5 pl-8 pr-3 text-sm focus:border-[#1e3a5f] outline-none bg-white"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
        />
        {(searching || reverseLoading) && (
          <Loader2
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin"
          />
        )}
      </div>

      {results.length > 0 && (
        <ul className="bg-white border border-slate-200 rounded-md shadow-sm max-h-40 overflow-y-auto divide-y divide-slate-100">
          {results.map((r) => (
            <li key={r.place_id}>
              <button
                type="button"
                className="w-full text-left px-3 py-2.5 text-xs text-slate-700 hover:bg-blue-50 transition-colors flex items-start gap-2"
                onClick={() => handleSelectResult(r)}
              >
                <MapPin size={12} className="text-red-500 mt-0.5 shrink-0" />
                <span className="line-clamp-2">{r.display_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-md overflow-hidden border border-slate-300 shadow-inner">
        <LeafletMap
          center={center}
          flyTo={flyTarget}
          markerPos={markerPos}
          onMapClick={handlePlacePin}
          onMarkerDragEnd={handlePlacePin}
        />
      </div>

      <p className="text-[10px] text-slate-400 text-center">
        Ketik alamat di atas, atau klik/geser pin di peta
      </p>

      {markerPos && (
        <div className="flex justify-between items-center text-[10px] text-slate-500 bg-slate-50 px-2 py-1.5 rounded border border-slate-200">
          <span>
            Lat: <b className="text-slate-700">{markerPos[0].toFixed(6)}</b>
          </span>
          <span>
            Lng: <b className="text-slate-700">{markerPos[1].toFixed(6)}</b>
          </span>
        </div>
      )}
    </div>
  );
}
