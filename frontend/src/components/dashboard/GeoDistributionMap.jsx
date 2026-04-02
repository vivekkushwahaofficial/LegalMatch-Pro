import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./GeoDistributionMap.css";

const markerIcon = new L.Icon({
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const locations = [
  { id: 1, name: "Mumbai", coords: [19.076, 72.8777] },
  { id: 2, name: "Hyderabad", coords: [17.385, 78.4867] },
  { id: 3, name: "Bengaluru", coords: [12.9716, 77.5946] },
  { id: 4, name: "Jaipur", coords: [26.9124, 75.7873] },
  { id: 5, name: "Lucknow", coords: [26.8467, 80.9462] },
  { id: 6, name: "Ahmedabad", coords: [23.0225, 72.5714] },
];

export default function GeoDistributionMap() {
  const center = useMemo(() => [21.0, 77.0], []);

  return (
    <div className="geo-map-card">
      <div className="geo-map-header">
        <div>
          <p className="geo-map-label">Map View</p>
          <h3 className="geo-map-title">Geographic Distribution</h3>
        </div>
      </div>

      <div className="geo-map-wrapper">
        <MapContainer
          center={center}
          zoom={5}
          scrollWheelZoom={false}
          className="geo-map-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map((location) => (
            <Marker
              key={location.id}
              position={location.coords}
              icon={markerIcon}
            >
              <Popup>{location.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
        <div className="geo-map-badge">Interactive map integration ready</div>
      </div>
    </div>
  );
}
