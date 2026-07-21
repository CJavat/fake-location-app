import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

interface Props {
  visible: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const MockLocationPermissionModal = ({
  visible,
  onClose,
  onOpenSettings,
}: Props) => {
  const handleOpenSettings = () => {
    onOpenSettings();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Permiso requerido</Text>
              <Text style={styles.subtitle}>Ubicación simulada</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color="#6c757d" />
            </Pressable>
          </View>

          <Text style={styles.instructions}>Sigue estos pasos:</Text>

          <View style={styles.step}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Toca{" "}
              <Text style={styles.stepTextBold}>
                &quot;Seleccionar aplicación de ubicación simulada&quot;
              </Text>{" "}
              dentro de Opciones de desarrollador
            </Text>
          </View>

          <View style={styles.previewRow}>
            <Ionicons name="chevron-back" size={16} color="#495057" />
            <Text style={styles.previewRowText}>Opciones de desarrollador</Text>
          </View>
          <View style={[styles.previewRow, styles.previewRowHighlighted]}>
            <Ionicons name="location" size={16} color="#162a33" />
            <View style={styles.previewRowTextContainer}>
              <Text style={styles.previewRowText}>
                Seleccionar aplicación de ubicación simulada
              </Text>
              <Text style={styles.previewRowSubtext}>
                Sin conjunto de aplicaciones
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>2</Text>
            </View>
            <Text style={styles.stepText}>Selecciona esta app en la lista</Text>
          </View>

          <View style={[styles.previewRow, styles.previewRowHighlighted]}>
            <Ionicons name="location" size={16} color="#162a33" />
            <Text style={styles.previewRowText}>fake-location-app</Text>
          </View>

          <Pressable style={styles.settingsButton} onPress={handleOpenSettings}>
            <Text style={styles.settingsButtonText}>Ir a la configuración</Text>
          </Pressable>

          <Pressable onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212529",
  },
  subtitle: {
    fontSize: 13,
    color: "#162a33",
    fontWeight: "600",
    marginTop: 2,
  },
  instructions: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 10,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
  },
  stepBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#162a33",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#212529",
    lineHeight: 19,
  },
  stepTextBold: {
    fontWeight: "700",
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f1f3f5",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  previewRowHighlighted: {
    backgroundColor: "#eaf2ff",
    borderWidth: 1,
    borderColor: "#162a33",
  },
  previewRowTextContainer: {
    flex: 1,
  },
  previewRowText: {
    fontSize: 13,
    color: "#212529",
    fontWeight: "500",
  },
  previewRowSubtext: {
    fontSize: 11,
    color: "#868e96",
    marginTop: 1,
  },
  settingsButton: {
    backgroundColor: "#162a33",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  settingsButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: "#868e96",
    fontSize: 14,
    fontWeight: "500",
  },
});
