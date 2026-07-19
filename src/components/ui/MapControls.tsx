import { StyleSheet, Alert, View, Platform } from "react-native";

import { IoniconPressable } from "../IoniconPressable";

interface MapControlsProps {
  onLocateUser: () => void;
  onJoystickPress: () => void;
  onFavoritesPress: () => void;
}

export const MapControls = ({
  onLocateUser,
  onJoystickPress,
  onFavoritesPress,
}: MapControlsProps) => {
  return (
    <View style={styles.containerMapControls}>
      <IoniconPressable
        iconName="game-controller-outline"
        iconSize={17}
        lineBottom={true}
        action={() => onJoystickPress}
      />

      <IoniconPressable
        iconName="star-outline"
        iconSize={17}
        lineBottom={true}
        action={() => onFavoritesPress}
      />

      <IoniconPressable
        iconName="locate-outline"
        iconSize={17}
        action={() => onLocateUser()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerMapControls: {
    position: "absolute",
    bottom: 20,
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
});
