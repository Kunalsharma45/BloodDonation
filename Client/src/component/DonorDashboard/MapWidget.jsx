import React, { useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import client from "../../api/client";
import "leaflet/dist/leaflet.css";

// Fix default marker icon paths for Leaflet when bundled
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: icon2x,
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = new L.Icon({
  iconUrl: icon,
  iconRetinaUrl: icon2x,
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "text-red-600",
});

const MapWidget = () => {
  const [coords, setCoords] = useState(() => {
    const saved = localStorage.getItem("liforceCoords");
    return saved ? JSON.parse(saved) : { lat: 28.6, lng: 77.2 };
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const center = useMemo(() => [coords.lat, coords.lng], [coords]);
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [mapKey, setMapKey] = useState(() => `map-${Date.now()}`);

  useEffect(() => {
    setMounted(true);
    const id = requestAnimationFrame(() => setReady(true)); // avoid StrictMode double-mount conflict
    return () => {
      cancelAnimationFrame(id);
      setMounted(false);
      cleanupLeaflet();
    };
  }, []);

  useEffect(() => {
    // when coords change, force a fresh key and clean existing container
    cleanupLeaflet();
    setMapKey(`map-${coords.lat}-${coords.lng}-${Date.now()}`);
  }, [coords]);

  const cleanupLeaflet = () => {
    if (mapRef.current) {
      const container = mapRef.current.getContainer?.();
      mapRef.current.remove();
      mapRef.current = null;
      if (container && container._leaflet_id) {
        container._leaflet_id = null;
      }
    }
    const orphan = containerRef.current?.querySelector(".leaflet-container");
    if (orphan) {
      if (orphan._leaflet_id) orphan._leaflet_id = null;
      orphan.remove();
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await client.get("/api/donor/requests/nearby", {
          params: { lat: coords.lat, lng: coords.lng, km: 10 },
        });
        setRequests(res.data.requests || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [coords]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Nearby Map</h3>

      <div ref={containerRef} className="flex-1 rounded-xl overflow-hidden border border-gray-200 min-h-[320px]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <Loader2 className="animate-spin mr-2" size={18} /> Loading map...
          </div>
        ) : !mounted || !ready ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <Loader2 className="animate-spin mr-2" size={18} /> Loading map...
          </div>
        ) : (
          <MapContainer
            key={mapKey}
            whenCreated={(map) => {
              mapRef.current = map;
            }}
            center={center}
            zoom={13}
            scrollWheelZoom
            className="h-full w-full"
            style={{ height: "100%", width: "100%" }}
          >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Circle center={center} radius={10000} pathOptions={{ color: "#ef4444", fillOpacity: 0.05 }} />

              <Marker position={center}>
                <Popup>You are here</Popup>
              </Marker>

              {requests.map((r) => {
                const [lng, lat] = r.locationGeo?.coordinates || [];
                if (!lat || !lng) return null;
                return (
                  <Marker key={r._id} position={[lat, lng]} icon={redIcon}>
                    <Popup>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-gray-800">{r.caseId || "Blood Request"}</p>
                        <p>Group: {r.bloodGroup}</p>
                        <p>Units: {r.units}</p>
                        <p>Urgency: {r.urgency}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Showing requests within 10 km. Update location in Nearby Requests to refresh pins.
      </div>
    </div>
  );
};

export default MapWidget;
