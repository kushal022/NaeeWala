import { useState, useRef } from "react";
import { searchAddress } from "../../services/location/search";

export default function SearchAddress({ onSelect }) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState([]);
    const timeoutRef = useRef(null);

    const clrResult = () => {
        const clearResult = setTimeout(() => {
            setResult([]);
        }, 500)
        clearTimeout(clearResult)
    }
    const handleSearch = async (value) => {
        if (!value.trim()) return;
        setLoading(true);
        setError("");
        result?.length && clrResult();

        try {
            const data = await searchAddress(value);

            if (!data) {
                setError("No location found");
            } else {
                console.log("address:  - ", data)
                setResult(data);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to search location");
        } finally {
            setLoading(false);
        }
    };

    const selectHandle = (loc) => {
        const location = {
            lat: Number(loc.lat),
            lng: Number(loc.lon),
            address: loc.display_name,
            raw: loc.address,
            boundingbox: loc.boundingbox,
            addresstype: loc.addresstype,
        };
        onSelect?.(location)
    }

    // debounce:
    const handleChange = (e) => {
        setResult(null)
        const value = e.target.value;
        setQuery(value);

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (value.length > 3) handleSearch(value);
        }, 1000); // ≥ 1 req/sec
    };

    return (
        <div className="space-y-2">
            <input
                type="text"
                placeholder="Search address..."
                value={query}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
            />

            {loading && <p className="text-sm text-muted">Searching...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {result && result?.map((loc, i) => (
                <div
                    key={i}
                    className="p-2 border rounded bg-surface text-sm cursor-pointer "
                    onClick={() => selectHandle(loc)}
                >
                    <p className="font-medium">{loc.display_name}</p>
                    <p>
                        {/* Lat: {loc.lat}, Lng: {loc.lon} */}
                    </p>
                </div>)
            )}
        </div>
    );
}
