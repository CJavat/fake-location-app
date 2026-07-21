import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import { isFavorite, toggleFavorite } from "@/lib/storage";
import {
  onFakeLocationStopped,
  openDeveloperOptions,
  startFakeLocation,
  stopFakeLocation,
} from "@/services/mock-location.service";

import { MockLocationPermissionModal } from "./MockLocationPermissionModal";

import type { LocationItem } from "@/interfaces";

interface Props {
  locationItem: LocationItem;
  coordinates: number[];
}

export const BottomPanel = ({ locationItem, coordinates }: Props) => {
  const [isFav, setIsFav] = useState(() => isFavorite(locationItem.id));
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [showMockLocationHelp, setShowMockLocationHelp] = useState(false);

  useEffect(() => {
    setIsFav(isFavorite(locationItem.id));
  }, [locationItem.id]);

  useEffect(() => {
    return onFakeLocationStopped(() => setIsSimulating(false));
  }, []);

  const handleToggleFavorite = () => {
    toggleFavorite(locationItem);
    setIsFav((prev) => !prev);
  };

  const handleStartSimulation = async (lat: number, lon: number) => {
    const result = await startFakeLocation(lat, lon);

    if (!result.success) {
      if (result.reason === "mock-location-app-not-selected") {
        setShowMockLocationHelp(true);
        return;
      }

      const message =
        result.reason === "permission-denied"
          ? "Debes conceder acceso a tu ubicación para poder simular una ubicación falsa."
          : (result.message ??
            "No se pudo iniciar la simulación de ubicación.");

      Alert.alert("No se pudo simular la ubicación", message);
      return;
    }

    setIsSimulating(true);
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
    stopFakeLocation();
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

        {isSimulating ? (
          <Pressable
            style={styles.stopSimulateButton}
            onPress={handleStopSimulation}
          >
            <Text style={styles.simulateTextButton}>Detener simulación</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.simulateButton}
            onPress={() =>
              handleStartSimulation(
                +coordinates[1].toFixed(6),
                +coordinates[0].toFixed(6),
              )
            }
          >
            <Text style={styles.simulateTextButton}>Simular ubicación</Text>
          </Pressable>
        )}
      </View>

      <MockLocationPermissionModal
        visible={showMockLocationHelp}
        onClose={() => setShowMockLocationHelp(false)}
        onOpenSettings={openDeveloperOptions}
      />
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
  stopSimulateButton: {
    flexGrow: 1,
    backgroundColor: "#FF2C2C",
    padding: 15,
    borderRadius: 5,
  },
  simulateTextButton: {
    color: "#FFF",
    alignSelf: "center",
    fontWeight: "bold",
  },
});
