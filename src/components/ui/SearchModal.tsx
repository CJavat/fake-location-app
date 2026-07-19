import { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";

import { updateLocationQuery } from "@/actions/location.action";
import {
  addRecentSearch,
  getRecentSearches,
  type LocationItem,
} from "@/lib/storage";

import type { SearchResults } from "@/interfaces";

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (coords: [number, number]) => void;
  userLocation?: [number, number];
}

export const SearchModal = ({
  visible,
  onClose,
  onSelectLocation,
  userLocation,
}: SearchModalProps) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResults[]>([]);
  const [recentSearches, setRecentSearches] = useState<LocationItem[]>([]);

  useEffect(() => {
    if (visible) {
      setRecentSearches([...getRecentSearches()].reverse());
    }
  }, [visible]);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        const data = await updateLocationQuery(query, userLocation);

        setResults(data.features || []);
      } catch (error) {
        console.error("Error fetching geocoding:", error);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query, userLocation]);

  const handleSelectLocation = (item: LocationItem) => {
    addRecentSearch(item);
    onSelectLocation([item.lon, item.lat]);
    setQuery("");
  };

  const showingRecents = query.length === 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle={Platform.OS === "ios" ? "overFullScreen" : undefined}
    >
      <View style={styles.container}>
        <View
          style={{
            position: "relative",
            borderBottomWidth: 1,
            paddingHorizontal: 10,
            paddingVertical: Platform.OS === "ios" ? 5 : 0,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextInput
            style={styles.input}
            placeholder="Buscar lugar..."
            placeholderTextColor="#b2b2b2"
            onChangeText={setQuery}
            value={query}
            autoFocus
          />

          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Text style={{ color: "#b2b2b2", fontSize: 20 }}>X</Text>
            </Pressable>
          )}
        </View>

        {showingRecents ? (
          <FlatList
            data={recentSearches}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              recentSearches.length > 0 ? (
                <Text style={styles.sectionTitle}>Búsquedas recientes</Text>
              ) : null
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Aún no tienes búsquedas recientes
              </Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectLocation(item)}
              >
                <Ionicons
                  name="time-outline"
                  size={18}
                  color="#8a8a8a"
                  style={styles.resultIcon}
                />
                <Text style={styles.resultText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() =>
                  handleSelectLocation({
                    id: item.id,
                    name: item.place_name_es,
                    lon: item.center[0],
                    lat: item.center[1],
                  })
                }
              >
                <Ionicons
                  name="location-outline"
                  size={18}
                  color="#8a8a8a"
                  style={styles.resultIcon}
                />
                <Text style={styles.resultText}>{item.place_name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  input: { fontSize: 16, width: "100%" },
  sectionTitle: {
    paddingTop: 15,
    paddingBottom: 5,
    fontSize: 13,
    fontWeight: "600",
    color: "#8a8a8a",
  },
  emptyText: {
    paddingVertical: 20,
    textAlign: "center",
    color: "#8a8a8a",
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  resultIcon: { marginRight: 12 },
  resultText: { fontSize: 15, flexShrink: 1 },
  closeButton: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: "#FF2C2C",
    alignItems: "center",
    borderRadius: 10,
  },
});
