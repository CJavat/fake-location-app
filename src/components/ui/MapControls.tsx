import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { IoniconPressable } from "../IoniconPressable";

interface MapControlsProps {
  onLocateUser: () => void;
  onJoystickPress: () => void;
}

export const MapControls = ({
  onLocateUser,
  onJoystickPress,
}: MapControlsProps) => {
  const handleNavigateToFavorites = () => {
    router.push("/favorites");
  };

  return (
    <View style={styles.containerMapControls}>
      <IoniconPressable
        iconName="game-controller-outline"
        iconSize={25}
        lineBottom={true}
        action={() => onJoystickPress}
      />

      <IoniconPressable
        iconName="star-outline"
        iconSize={25}
        lineBottom={true}
        action={handleNavigateToFavorites}
      />

      <IoniconPressable
        iconName="locate-outline"
        iconSize={25}
        action={() => onLocateUser()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerMapControls: {
    position: "absolute",
    bottom: 20,
    right: 10,
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
