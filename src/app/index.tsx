import Mapbox from "@rnmapbox/maps";
import { useState } from "react";
import {
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@react-native-vector-icons/ionicons";

const mapboxToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";
let insets: EdgeInsets;

Mapbox.setAccessToken(mapboxToken ?? "");

export default function HomeScreen() {
  insets = useSafeAreaInsets();
  const [coordinates, setCoordinates] = useState<[number, number]>([
    -103.456968, 20.699699,
  ]);
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(15);
  const [locationName, setLocationName] = useState<string>(
    "Buscando ubicación...",
  );

  const onRegionWillChange = () => {
    setIsUserInteracting(true);
  };

  const onRegionDidChange = async (event: any) => {
    setIsUserInteracting(false);

    if (event.properties && event.properties.center) {
      const [longitude, latitude] = event.properties.center;
      setCoordinates([longitude, latitude]);
      setZoom(event.properties.zoom);

      try {
        //TODO: Esto se va a mejorar, para usar Axios.
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}&language=es&limit=1`,
        );
        const data = await response.json();

        data.features && data.features.length > 0
          ? setLocationName(data.features[0].place_name)
          : setLocationName("Colonia o calle desconocida");
      } catch (error) {
        setLocationName("Error al obtener la dirección");
        console.error("Geocoding error:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Street}
        logoEnabled={true}
        attributionEnabled={false}
        onCameraChanged={onRegionWillChange}
        onMapIdle={onRegionDidChange}
        scaleBarPosition={{
          top:
            Platform.OS === "android"
              ? (StatusBar.currentHeight ?? 0) + 12
              : 12,
          left: 15, // Mantiene la alineación original a la izquierda
        }}
      >
        <Mapbox.Camera zoomLevel={zoom} centerCoordinate={coordinates} />
      </Mapbox.MapView>

      <View style={styles.pointerContainer} pointerEvents="none">
        <View
          style={[styles.pointer, isUserInteracting && styles.pointerActive]}
        />
      </View>

      {/* 
        //TODO: HACER LO COMPONENTE Y ENVIAR LAS PROPIEDADES NECESARIAS.
      */}
      <View
        style={[
          styles.searchButton,
          {
            top:
              Platform.OS === "android"
                ? (StatusBar.currentHeight ?? 0) + 5
                : useSafeAreaInsets().top,
          },
        ]}
      >
        <Pressable onPress={() => console.log("Botón BUSCAR presionado")}>
          <Ionicons name="search-outline" size={17} />
        </Pressable>
      </View>

      <View style={styles.containerButtonLocation}>
        <Pressable onPress={() => console.log("Botón JOYSTICK presionado")}>
          <Ionicons name="game-controller-outline" size={17} />
        </Pressable>

        <View
          style={{
            borderBottomColor: "#b2b2b2",
            borderBottomWidth: 1,
          }}
        ></View>

        <Pressable onPress={() => console.log("Botón FAVORITOS presionado")}>
          <Ionicons name="star-outline" size={17} />
        </Pressable>

        <View
          style={{
            borderBottomColor: "#b2b2b2",
            borderBottomWidth: 1,
          }}
        ></View>

        <Pressable
          onPress={() => console.log("Botón ESTABLECER UBICACION presionado")}
        >
          <Ionicons name="locate-outline" size={17} />
        </Pressable>
      </View>

      <View style={styles.infoPanel}>
        <View style={styles.infoLocation}>
          <Ionicons name="location-outline" size={17} />
          <Text style={styles.coordinatesText}>{locationName}</Text>
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

        <Pressable
          style={styles.simulateButton}
          onPress={() => console.log("Botón SIMULAR UBICACIÓN presionado")}
        >
          <Text style={styles.simulateTextButton}>Simular ubicación</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: "rgba(244, 67, 54, 0.9)",
  },
  searchButton: {
    position: "absolute",
    right: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  containerButtonLocation: {
    position: "absolute",
    bottom: 250,
    right: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    gap: 10,
  },
  infoPanel: {
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
  simulateButton: {
    marginTop: 30,
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
