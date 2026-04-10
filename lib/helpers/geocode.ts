// This helper fetches latitude and longitude from a location string
// It uses the Nominatim OpenStreetMap geocoding API

export interface GeocodeResult {
  lat: string;
  lon: string;
}

export async function getCoordinates(
  location: string,
): Promise<GeocodeResult | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location,
      )}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch geocoding data.");
    }

    const data = await response.json();

    if (!data.length) {
      return null;
    }

    return {
      lat: data[0].lat,
      lon: data[0].lon,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}
