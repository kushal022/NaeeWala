
export async function searchAddress(address) {
    if (!address || address.length < 3) return null;

    const url = `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
            q: address,
            format: "jsonv2",
            addressdetails: "1",
            limit: "5",
            countrycodes: "in",
        });

    const res = await fetch(url, {
        method: "GET",
        headers: {
            // REQUIRED by Nominatim usage policy
            // "User-Agent": "NaeeWala/1.0 (contact@naeewala.com)",
            "Accept": "application/json",
            "Accept-Language": "en",
        },
    });

    if (!res.ok) {
        console.error("Nominatim error:", res.status);
        return null;
    }

    const data = await res.json();
    // console.log("Nominatim data:", data);

    return data.length ? data : null;
}


