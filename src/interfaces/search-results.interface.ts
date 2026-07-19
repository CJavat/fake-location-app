export interface SearchResults {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: Properties;
  text_es: string;
  place_name_es: string;
  text: string;
  place_name: string;
  matching_text: string;
  matching_place_name: string;
  bbox: number[];
  center: number[];
  geometry: Geometry;
  context: Context[];
}

interface Context {
  id: string;
  mapbox_id: string;
  wikidata: string;
  text_es: string;
  language_es: string;
  text: string;
  language: string;
  short_code?: string;
}

interface Geometry {
  type: string;
  coordinates: number[];
}

interface Properties {
  mapbox_id: string;
}
