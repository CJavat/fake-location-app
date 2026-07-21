import { SearchResults } from "./search-results.interface";

export interface MapboxPlacesResponse {
  type: string;
  query: string[];
  features: SearchResults[];
  attribution: string;
}
