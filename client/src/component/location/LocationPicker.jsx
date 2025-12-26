import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import { reverseGeocode } from "../../services/location/reverse";
import { Rectangle } from "react-leaflet";
import MapController from "./MapController";
import { GeoJSON } from "react-leaflet";

export default function LocationPicker({ value, onChange, boundary, formData }) {
  const [position, setPosition] = useState({
    lat: 26.9124, // Jaipur default
    lng: 75.7873,
  });
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (value?.lat && value?.lng) {
      setPosition({ lat: value.lat, lng: value.lng });
    }
  }, [value]);

  function ClickHandler({ onPick }) {
    useMapEvents({
      click(e) {
        onPick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  const updateLocation = async (lat, lng) => {
    setPosition({ lat, lng });
    // console.log('click: ', lat, lng)
    const data = await reverseGeocode(lat, lng);
    if (data.display_name) {
      setAddress(data.display_name);
      onChange?.({
        lat,
        lng,
        address: data.display_name,
        raw: data.address,
      });
    }
    // console.log('address: ', address, data)
  };

  function parseBoundingBox(boundingbox) {
    if (!boundingbox || boundingbox.length !== 4) return null;

    const [south, north, west, east] = boundingbox.map(Number);

    return [
      [south, west],
      [north, east],
    ];
  }

  const bounds = boundary
    ? parseBoundingBox(boundary)
    : null;

  function getZoomByAddressType(type) {
    switch (type) {
      case "country":
        return 4;

      case "state":
      case "province":
        return 5;

      case "state_district":
      case "district":
        return 8.5;

      case "county":
        return 11

      case "city":
      case "town":
        return 10.5;

      case "suburb":
      case "village":
        return 14;

      case "street":
      case "road":
      case "neighbourhood":
        return 16;

      case "amenity":
      case "building":
      case "poi":
        return 18;

      default:
        return 13;
    }
  };

  const autoZoom = getZoomByAddressType(formData.address.addresstype);


  return (
    <div>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution="@ NNN"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Auto zoom to boundary */}
        <MapController position={position} zoom={autoZoom} />

        {/*  Draw boundary */}
        {bounds && (
          <Rectangle
            bounds={bounds}
            pathOptions={{
              color: "#0ea5e9",     // sky-500
              weight: 2,
              dashArray: "8 6",
              fillColor: "#38bdf8",
              fillOpacity: 0.08,
            }}
            eventHandlers={{
              mouseover: (e) => e.target.setStyle({ fillOpacity: 0.15 }),
              mouseout: (e) => e.target.setStyle({ fillOpacity: 0.08 }),
            }}
          />


        )}

        <ClickHandler onPick={updateLocation} />

        <Marker
          position={position}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const { lat, lng } = e.target.getLatLng();
              updateLocation(lat, lng);
            },
          }}
        />
      </MapContainer>

      {position && <div style={{ marginTop: 10 }}>
        <p><b>Lat:</b> {position.lat}</p>
        <p><b>Lng:</b> {position.lng}</p>
        <p><b>Address:</b> {address}</p>
      </div>}
    </div>
  );
}
