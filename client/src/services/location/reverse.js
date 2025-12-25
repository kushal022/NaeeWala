export async function reverseGeocode(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            // REQUIRED by Nominatim usage policy
            // "User-Agent": "NaeeWala/1.0 (contact@naeewala.com)",
            "Accept": "application/json",
            "Accept-Language": "en",
        },
    });

    return await res.json();
}
