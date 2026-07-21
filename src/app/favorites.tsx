import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  Animated,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import { getFavorites, toggleFavorite } from "@/lib/storage";
import type { LocationItem } from "@/interfaces";
import { router } from "expo-router";

export default function FavoritesScreen() {
  const [favoriteLocation, setFavoriteLocation] = useState<LocationItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const favorites = getFavorites();
    setFavoriteLocation(favorites);
  }, []);

  const showToast = (message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setToastMessage(message);

    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    timerRef.current = globalThis.setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setToastMessage(null);
      });
    }, 2200);
  };

  const goToFavoriteLocation = (item: LocationItem) => {
    router.push({
      pathname: "/",
      params: {
        lat: item.lat,
        lon: item.lon,
      },
    });
  };

  const deleteFavoriteLocation = (item: LocationItem) => {
    toggleFavorite(item);

    setFavoriteLocation((prev) => prev.filter((fav) => fav.id !== item.id));

    showToast("Ubicación eliminada de favoritos");
  };

  return (
    <View style={styles.pageContainer}>
      <FlatList
        data={favoriteLocation}
        keyExtractor={(location) => location.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={50} color="#ccc" />
            <Text style={styles.emptyList}>
              No tienes ubicaciones favoritas
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.favoriteItemContainer}>
            <TouchableOpacity
              style={styles.favoriteItem}
              activeOpacity={0.7}
              onPress={() => goToFavoriteLocation(item)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="pin" size={22} color="#ff3b30" />
              </View>
              <Text style={styles.favoriteText} numberOfLines={2}>
                {item.name}
              </Text>
            </TouchableOpacity>

            <Pressable
              style={({ pressed }) => [
                styles.trashButton,
                pressed && { opacity: 0.5 },
              ]}
              onPress={() => deleteFavoriteLocation(item)}
            >
              <Ionicons name="trash-outline" size={18} color="#ff3b30" />
            </Pressable>
          </View>
        )}
      />

      {toastMessage && (
        <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
          <Ionicons name="information-circle" size={18} color="#fff" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    gap: 10,
  },
  emptyList: {
    color: "#6c757d",
    fontSize: 16,
    fontWeight: "500",
  },
  favoriteItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: { ios: 0.1, android: 0.2 } as any,
    shadowRadius: 3,
  },
  favoriteItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginRight: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteText: {
    flex: 1,
    fontSize: 15,
    color: "#212529",
    lineHeight: 20,
  },
  trashButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#fff5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  toastContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#212529e6",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    gap: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 999,
  },
  toastText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
});
