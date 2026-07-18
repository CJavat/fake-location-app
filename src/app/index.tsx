import Mapbox from "@rnmapbox/maps";
import { useState } from "react";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";

// Inicializa Mapbox con tu token público (pk.)
Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "");

export default function HomeScreen() {
  const [coordinates, setCoordinates] = useState<[number, number]>([
    -103.456968, 20.699699,
  ]);
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(15);

  // Manejador del movimiento de la cámara del mapa
  const onRegionWillChange = () => {
    setIsUserInteracting(true);
  };

  const onRegionDidChange = async (event: any) => {
    setIsUserInteracting(false);

    if (event.properties && event.properties.center) {
      const [longitude, latitude] = event.properties.center;
      setCoordinates([longitude, latitude]);
      setZoom(event.properties.zoom);
    }
  };

  return (
    <View style={styles.container}>
      {/* El Mapa */}
      <Mapbox.MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Street}
        logoEnabled={true}
        attributionEnabled={false}
        onCameraChanged={onRegionWillChange}
        onMapIdle={onRegionDidChange}
      >
        <Mapbox.Camera zoomLevel={zoom} centerCoordinate={coordinates} />
      </Mapbox.MapView>

      {/* Mira fija en el centro de la pantalla */}
      <View style={styles.pointerContainer} pointerEvents="none">
        <View
          style={[styles.pointer, isUserInteracting && styles.pointerActive]}
        />
      </View>

      {/* Panel de Información de Coordenadas */}
      <View style={styles.infoPanel}>
        <Text style={styles.panelTitle}>📍 Ubicación</Text>
        <Text style={styles.coordinatesText}>
          Lat: {coordinates[1].toFixed(6)} | Lng: {coordinates[0].toFixed(6)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  map: {
    flex: 1,
  },
  pointerContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  pointer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(33, 150, 243, 0.9)",
    borderWidth: 3,
    borderColor: "#ffffff",
    elevation: 5,
    transform: [{ scale: 1 }],
  },
  pointerActive: {
    transform: [{ scale: 1.3 }],
    backgroundColor: "rgba(244, 67, 54, 0.9)", // Cambia a rojo cuando te mueves
  },
  infoPanel: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  panelTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "monospace",
  },
});
