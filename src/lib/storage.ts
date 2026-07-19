import { createMMKV } from "react-native-mmkv";
export const storage = createMMKV();

import type { LocationItem } from "@/interfaces";

const FAVORITES_KEY = "favorites";
const RECENT_KEY = "recent_searches";

export const getFavorites = (): LocationItem[] => {
  const data = storage.getString(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
};

export const isFavorite = (id: LocationItem["id"]): boolean => {
  const favorites = getFavorites();
  return favorites.some((f) => f.id === id);
};

export const toggleFavorite = (item: LocationItem) => {
  const favorites = getFavorites();
  const index = favorites.findIndex((f) => f.id === item.id);

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(item);
  }

  storage.set(FAVORITES_KEY, JSON.stringify(favorites));
};

export const getRecentSearches = (): LocationItem[] => {
  const data = storage.getString(RECENT_KEY);
  return data ? JSON.parse(data) : [];
};

export const addRecentSearch = (item: LocationItem) => {
  let recents = getRecentSearches();

  recents = recents.filter((r) => r.id !== item.id);
  if (recents.length >= 20) {
    recents.shift();
  }

  recents.push(item);
  storage.set(RECENT_KEY, JSON.stringify(recents));
};
