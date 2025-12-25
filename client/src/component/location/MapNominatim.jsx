import { useState, useMemo } from "react";
import LocationPicker from "./LocationPicker";
import SearchAddress from "./SearchAddress";

export default function MapNominatim() {
    const [formData, setFormData] = useState({
        address: {
            lat: null,
            lng: null,
            street: "",
            boundingbox: '',
            addresstype: '',
        },
    });

    // console.log("daa; ", formData)

    // Redirect to Google Map:
    const mapUrl = useMemo(() => {
        const { lat, lng } = formData.address;
        if (!lat || !lng) return null;
        return `https://www.google.com/maps/place/${lat},${lng}`;
    }, [formData.address.lat, formData.address.lng]);

    return (
        <div className="space-y-6">
            {/* Search box */}
            <SearchAddress
                onSelect={(loc) => {
                    console.log("locatioln: ", loc)
                    setFormData((prev) => ({
                        ...prev,
                        address: {
                            lat: loc.lat,
                            lng: loc.lng,
                            street: loc.address,
                            boundingbox: loc.boundingbox,
                            addresstype: loc.addresstype
                        },
                    }));
                }}
            />

            {/* Open map link */}
            {mapUrl && (
                <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                >
                    Open in Google Maps
                </a>
            )}

            {/* Map */}
            <div className="w-full h-100 rounded-lg overflow-hidden border">
                <LocationPicker
                    value={formData.address}
                    boundary={formData.address.boundingbox}
                    formData={formData}
                    onChange={(loc) => {
                        setFormData((prev) => ({
                            ...prev,
                            address: {
                                ...prev.address,
                                lat: loc.lat,
                                lng: loc.lng,
                                street: loc.address,
                                boundingbox: loc.boundingbox,
                                addresstype: loc.addresstype,
                            },
                        }));
                    }}
                />
            </div>
            {formData.address.lat && <div style={{ marginTop: 10 }}>
                <p><b>Lat:</b> {formData.address.lat}</p>
                <p><b>Lng:</b> {formData.address.lng}</p>
                <p><b>Address:</b> {formData.address.street}</p>
            </div>}
        </div>
    );
}

