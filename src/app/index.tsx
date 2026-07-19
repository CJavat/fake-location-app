import { useEffect, useRef, useState } from "react";
import { Alert, Platform, StatusBar, StyleSheet, View } from "react-native";

import Mapbox from "@rnmapbox/maps";
import * as ExpoLocation from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BottomPanel,
  IoniconPressable,
  MapControls,
  SearchModal,
} from "@/components";
import { updateLocation } from "@/actions/location.action";
import { CoordsResults } from "@/interfaces";

const mapboxToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";
Mapbox.setAccessToken(mapboxToken ?? "");

export default function HomeScreen() {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const [coordinates, setCoordinates] = useState<[number, number]>([
    -103.456968, 20.699699,
  ]);
  const [locationInformation, setLocationInformation] =
    useState<CoordsResults>();
  const [debouncedCoords, setDebouncedCoords] =
    useState<[number, number]>(coordinates);
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(15);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCoords(coordinates);
    }, 500);

    return () => clearTimeout(handler);
  }, [coordinates]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const data = await updateLocation({
          latitude: coordinates[1],
          longitude: coordinates[0],
        });

        setLocationInformation(data);
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    };

    fetchAddress();
  }, [debouncedCoords]);

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

  const goToCurrentLocation = async () => {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Necesitas dar acceso a la ubicación");
      return;
    }

    const location = await ExpoLocation.getCurrentPositionAsync({
      accuracy:
        Platform.OS === "ios"
          ? ExpoLocation.Accuracy.Highest
          : ExpoLocation.Accuracy.High,
    });

    const centerCoordinate: [number, number] = [
      location.coords.longitude,
      location.coords.latitude,
    ];

    setCoordinates(centerCoordinate);
    setZoom(16);

    cameraRef.current?.setCamera({
      centerCoordinate,
      zoomLevel: 16,
      animationDuration: 700,
    });
  };

  const handleSelectLocation = (coords: [number, number]) => {
    const [longitude, latitude] = coords;
    setCoordinates([longitude, latitude]);

    cameraRef.current?.setCamera({
      centerCoordinate: [longitude, latitude],
      zoomLevel: 16,
      animationDuration: 1000,
    });

    setIsSearchModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
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
            left: 15,
          }}
        >
          <Mapbox.Camera
            ref={cameraRef}
            zoomLevel={zoom}
            centerCoordinate={coordinates}
          />
        </Mapbox.MapView>

        {/* PUNTERO */}
        <View style={styles.pointerContainer} pointerEvents="none">
          <View
            style={[styles.pointer, isUserInteracting && styles.pointerActive]}
          />
        </View>

        {/* SEARCH BUTTON */}
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
          <IoniconPressable
            iconName="search-outline"
            iconSize={17}
            action={() => setIsSearchModalVisible(true)}
          />

          <SearchModal
            visible={isSearchModalVisible}
            userLocation={coordinates}
            onClose={() => setIsSearchModalVisible(false)}
            onSelectLocation={(coords) => handleSelectLocation(coords)}
          />
        </View>

        <MapControls
          onLocateUser={goToCurrentLocation}
          onJoystickPress={() => console.log("Botón Joystick Presionado")}
          onFavoritesPress={() => console.log("Botón Favoritos Presionado")}
        />
      </View>

      {/* PANEL INFERIOR */}
      <BottomPanel
        coordinates={coordinates}
        locationItem={{
          id: locationInformation?.features[0].id ?? "",
          name:
            locationInformation?.features[0].place_name_es ??
            "Dirección desconocida",
          lon: locationInformation?.features[0].geometry.coordinates[0] ?? 0,
          lat: locationInformation?.features[0].geometry.coordinates[1] ?? 0,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapWrapper: {
    flex: 1,
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  pointerContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  pointer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2196f3e6",
    borderWidth: 3,
    borderColor: "#ffffff",
    elevation: 5,
    transform: [{ scale: 1 }],
  },
  pointerActive: {
    transform: [{ scale: 1.3 }],
    backgroundColor: "#f44336e6",
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
});
