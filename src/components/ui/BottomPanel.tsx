import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import { isFavorite, toggleFavorite } from "@/lib/storage";

import type { LocationItem } from "@/interfaces";

interface Props {
  locationItem: LocationItem;
  coordinates: number[];
}

export const BottomPanel = ({ locationItem, coordinates }: Props) => {
  const [isFav, setIsFav] = useState(() => isFavorite(locationItem.id));

  useEffect(() => {
    setIsFav(isFavorite(locationItem.id));
  }, [locationItem.id]);

  const handleToggleFavorite = () => {
    toggleFavorite(locationItem);
    setIsFav((prev) => !prev);
  };

  return (
    <View style={styles.panelContainer}>
      <View style={styles.infoLocation}>
        <Ionicons name="location-outline" size={17} />
        <Text style={styles.coordinatesText}>{locationItem.name}</Text>
      </View>

      <View
        style={{
          borderBottomColor: "#b2b2b2",
          borderBottomWidth: 1,
          marginVertical: 10,
          width: "90%",
          alignSelf: "center",
        }}
      ></View>

      <View style={styles.infoLocation}>
        <Ionicons name="flag-outline" size={17} />
        <Text style={styles.coordinatesText}>
          ( {coordinates[1].toFixed(6)}, {coordinates[0].toFixed(6)} )
        </Text>
      </View>

      <View
        style={{
          marginTop: 25,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Pressable onPress={handleToggleFavorite} style={styles.favoriteButton}>
          <Ionicons name={isFav ? "star" : "star-outline"} size={16} />
        </Pressable>

        <Pressable
          style={styles.simulateButton}
          onPress={() => console.log("Botón SIMULAR UBICACIÓN presionado")}
        >
          <Text style={styles.simulateTextButton}>Simular ubicación</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    height: 210,
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 25,
  },
  infoLocation: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  coordinatesText: {
    fontSize: 14,
    color: "#000",
  },
  favoriteButton: {
    borderWidth: 1,
    borderColor: "#162a334e",
    padding: 15,
    borderRadius: 5,
  },
  simulateButton: {
    flexGrow: 1,
    backgroundColor: "#162A33",
    padding: 15,
    borderRadius: 5,
  },
  simulateTextButton: {
    color: "#FFF",
    alignSelf: "center",
    fontWeight: "bold",
  },
});
