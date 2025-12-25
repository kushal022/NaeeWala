
import { useMap } from "react-leaflet";
import { useEffect } from "react";

export default function MapController({ position, zoom = 13, bounds }) {
    const map = useMap();

    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, {
                padding: [40, 40],
                animate: true,
            });
            return;
        }
        if (position?.lat && position?.lng) {
            map.flyTo([position.lat, position.lng], zoom, {
                animate: true,
                duration: 1.2,
            });
        }
    }, [position, zoom, map, bounds]);

    return null;
}
