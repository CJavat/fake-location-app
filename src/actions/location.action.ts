import { api } from "@/lib/api";

import type {
  CoordsResults,
  MapboxPlacesResponse,
  SearchResults,
} from "@/interfaces";

type LocationPayload = {
  latitude: number;
  longitude: number;
};

const mapboxToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

export async function updateLocation(
  payload: LocationPayload,
): Promise<CoordsResults> {
  const { data } = await api.get<CoordsResults>(
    `/geocoding/v5/mapbox.places/${payload.longitude},${payload.latitude}.json?access_token=${mapboxToken}&language=es&limit=1`,
  );

  return data;
}

export async function updateLocationQuery(
  query: string,
  userLocation?: [number, number],
): Promise<SearchResults[]> {
  const proximity = userLocation
    ? `&proximity=${userLocation[0]},${userLocation[1]}`
    : "";
  const { data } = await api.get<MapboxPlacesResponse>(
    `/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&autocomplete=true&language=es${proximity}`,
  );

  return data.features;
}
