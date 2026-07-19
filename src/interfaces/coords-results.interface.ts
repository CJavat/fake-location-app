export interface CoordsResults {
  type: string;
  query: number[];
  features: Feature[];
  attribution: string;
}

interface Feature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: Properties;
  text_es: string;
  language_es: string;
  place_name_es: string;
  text: string;
  language: string;
  place_name: string;
  center: number[];
  geometry: Geometry;
  address: string;
  context: Context[];
}

interface Context {
  id: string;
  mapbox_id: string;
  text_es: string;
  language_es: string;
  text: string;
  language: string;
  wikidata?: string;
  short_code?: string;
}

interface Geometry {
  type: string;
  coordinates: number[];
}

interface Properties {
  accuracy: string;
  mapbox_id: string;
}
